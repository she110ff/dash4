import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

/*
  Dash4 Infrastructure
  ====================================
  S3 + CloudFront  → React SPA (client)
  ECS Fargate      → NestJS API (server)
  RDS PostgreSQL   → Database
  ====================================
*/

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── VPC ──────────────────────────────────────
    const vpc = new ec2.Vpc(this, 'Dash4Vpc', {
      maxAzs: 2,
      natGateways: 1, // 비용 절감: NAT 1개
    });

    // ── RDS PostgreSQL ──────────────────────────
    const dbSecret = new secretsmanager.Secret(this, 'Dash4DbSecret', {
      secretName: 'dash4/db-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'dash4' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        passwordLength: 32,
      },
    });

    const db = new rds.DatabaseInstance(this, 'Dash4Db', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      credentials: rds.Credentials.fromSecret(dbSecret),
      databaseName: 'dash4',
      allocatedStorage: 20,
      maxAllocatedStorage: 50,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
      deletionProtection: false, // dev 환경용, prod에서는 true
    });

    // ── ECS Cluster ─────────────────────────────
    const cluster = new ecs.Cluster(this, 'Dash4Cluster', {
      vpc,
      containerInsights: false, // 비용 절감
    });

    // ── ECS Fargate Service (NestJS) ────────────
    const apiService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'Dash4Api',
      {
        cluster,
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 1, // v1: 단일 태스크 (eng review 결정)
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset('../server'),
          containerPort: 7111,
          environment: {
            PORT: '7111',
            NODE_ENV: 'production',
            JWT_EXPIRATION: '15m',
            JWT_REFRESH_EXPIRATION: '7d',
          },
          secrets: {
            DATABASE_URL: ecs.Secret.fromSecretsManager(dbSecret, 'DATABASE_URL'),
            JWT_SECRET: ecs.Secret.fromSecretsManager(dbSecret, 'JWT_SECRET'),
            JWT_REFRESH_SECRET: ecs.Secret.fromSecretsManager(dbSecret, 'JWT_REFRESH_SECRET'),
          },
          logDriver: ecs.LogDrivers.awsLogs({
            streamPrefix: 'dash4-api',
            logRetention: logs.RetentionDays.TWO_WEEKS,
          }),
        },
        publicLoadBalancer: true,
      },
    );

    // ALB health check
    apiService.targetGroup.configureHealthCheck({
      path: '/api/health',
      healthyHttpCodes: '200',
    });

    // RDS → ECS 접근 허용
    db.connections.allowDefaultPortFrom(apiService.service);

    // ── S3 + CloudFront (React SPA) ─────────────
    const siteBucket = new s3.Bucket(this, 'Dash4SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.Distribution(this, 'Dash4Cdn', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.LoadBalancerV2Origin(apiService.loadBalancer, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          }),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        '/socket.io/*': {
          origin: new origins.LoadBalancerV2Origin(apiService.loadBalancer, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          }),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html', // SPA fallback
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // ── Outputs ─────────────────────────────────
    new cdk.CfnOutput(this, 'CloudFrontUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
    });

    new cdk.CfnOutput(this, 'AlbUrl', {
      value: `http://${apiService.loadBalancer.loadBalancerDnsName}`,
      description: 'API Load Balancer URL',
    });

    new cdk.CfnOutput(this, 'S3BucketName', {
      value: siteBucket.bucketName,
      description: 'S3 Bucket for static site',
    });

    new cdk.CfnOutput(this, 'DbEndpoint', {
      value: db.dbInstanceEndpointAddress,
      description: 'RDS PostgreSQL endpoint',
    });
  }
}
