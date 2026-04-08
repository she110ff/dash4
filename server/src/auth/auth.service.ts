import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 틀립니다');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('이메일 또는 비밀번호가 틀립니다');

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      mustChangePassword: user.mustChangePassword,
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { user, ...tokens };
  }

  async refresh(userId: string, oldRefreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, name: true, refreshToken: true, mustChangePassword: true },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('세션이 만료되었습니다');
    }

    const isMatch = await bcrypt.compare(oldRefreshToken, user.refreshToken);
    if (!isMatch) {
      // Refresh token rotation: 탈취 감지 → 전체 세션 무효화
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });
      throw new UnauthorizedException('비정상적인 접근이 감지되었습니다. 다시 로그인해주세요');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      user: { id: user.id, email: user.email, role: user.role, name: user.name, mustChangePassword: user.mustChangePassword },
      ...tokens,
    };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) throw new BadRequestException('현재 비밀번호가 틀립니다');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash, mustChangePassword: false },
    });
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync<object>(
        { sub: userId, email, role },
        { secret: process.env.JWT_SECRET!, expiresIn: (process.env.JWT_EXPIRATION || '15m') as any },
      ),
      this.jwtService.signAsync<object>(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET!, expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }
}
