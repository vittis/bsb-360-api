/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './auth.dto';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const refreshToken = ExtractJwt.fromHeader('x-refresh-token')(req);

    if (!token || !refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      return await super.canActivate(context);
    } catch (err) {
      //console.log('access token invalid');
      try {
        //console.log('verifying refresh token');
        const decodedRefreshToken: JWTPayload = this.jwtService.verify(
          refreshToken,
        ) as any;
        //console.log('verify success');

        const user = {
          email: decodedRefreshToken.email,
          id: decodedRefreshToken.id,
        };

        const {
          token: newToken,
          refreshToken: newRefreshToken,
        } = await this.authService.createTokens(user as any);

        req.user = user;

        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newToken);
        res.set('x-refresh-token', newRefreshToken);
        return true;
      } catch (err) {
        console.log(err);
      }

      throw new UnauthorizedException();
    }
  }
}
