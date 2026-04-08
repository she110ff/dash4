import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const config = new DocumentBuilder()
    .setTitle('Dash4 API')
    .setDescription('투명 후불제 MVP 제작 서비스 API')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('swagger.json', JSON.stringify(doc, null, 2));
  console.log('swagger.json generated');
  await app.close();
}

generate();
