import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtHelper } from '../utils/jwt.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const token = this.jwtHelper.getTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException({
        isError: true,
        message: 'Login required',
      });
    }

    const user = await this.jwtHelper.verify(token);
    if (user) {
      request.user = user;
      return request;
    }

    throw new UnauthorizedException({
      isError: true,
      message: 'Login required',
    });
  }
}
