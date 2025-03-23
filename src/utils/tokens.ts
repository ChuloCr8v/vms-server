import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { addMinutes } from 'date-fns';
import { hashData } from './hash';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  // jwt token
  generateToken(userId: string, email: string) {
    const token = this.jwtService.sign(
      { userId, email },
      { secret: process.env.JWT_SECRET_KEY, expiresIn: '7h' },
    );
    return token;
  }

  // verification token for signup and forgot password
  async generateVerificationToken() {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await hashData.hashString(token);

    const verificationTokenExpiresAt = addMinutes(new Date(), 30);

    return { token, hashedToken, verificationTokenExpiresAt };
  }

  tokenExpired(tokenExpiresAt: Date) {
    const expiresAt = new Date(tokenExpiresAt);
    const now = new Date();
    return expiresAt < now;
  }
}
