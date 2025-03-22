import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerService } from 'src/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/utils/tokens';

@Module({
  providers: [
    AuthService,
    PrismaService,
    MailerService,
    JwtService,
    TokenService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
