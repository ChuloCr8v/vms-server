import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExtractToken } from 'src/utils/extractToken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = ExtractToken.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user = await this.prisma.organization.findUnique({
        where: { id: payload.sub },
        select: { id: true },
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      console.log(user);

      // request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
