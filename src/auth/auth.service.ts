import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  LoginDTO,
  JWTPayload,
  RegisterDTO,
  UserAuthRO,
  UserRO,
} from './auth.dto';

export enum ThirdPartyProvider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<UserAuthRO> {
    const user = await this.userService.findByLogin(loginDTO);

    const { token, refreshToken } = await this.createTokens(user);

    return { user, token, refreshToken };
  }

  async register(registerDTO: RegisterDTO): Promise<UserAuthRO> {
    const user = await this.userService.create(registerDTO);
    const { token, refreshToken } = await this.createTokens(user);

    return { user, token, refreshToken };
  }

  async validateOAuthLogin(
    email: string,
    thirdPartyId: string,
    provider: ThirdPartyProvider,
  ): Promise<UserAuthRO> {
    const user = await this.userService.findOrCreateByThirdPartyId(
      email,
      thirdPartyId,
      provider,
    );

    const { token, refreshToken } = await this.createTokens(user);

    return { user, token, refreshToken };
  }

  async createTokens(
    user: UserRO,
  ): Promise<{ token: string; refreshToken: string }> {
    const payload: JWTPayload = {
      email: user.email,
      id: user.id,
    };

    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '3d',
    });

    return { token, refreshToken };
  }
}
