import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExtractToken } from 'src/utils/extractToken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = ExtractToken.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    // try {
    //   const payload = await this.jwt.verifyAsync(token, {
    //     secret: process.env.JWT_SECRET_KEY,
    //   });

    //     const user = await this.prisma.user.findUnique({
    //       where: { id: payload.sub },
    //       select: { id: true, roles: true },
    //     });

    //     // 💡 We're assigning the payload to the request object here
    //     // so that we can access it in our route handlers
    //     request['user'] = user;
    // } catch {
    //   throw new UnauthorizedException();
    // }
    return true;
  }
}
