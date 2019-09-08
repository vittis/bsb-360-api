import { Injectable, BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService, ThirdPartyProvider } from './auth.service';
import {
  StrategyOptionsWithRequest,
  VerifyCallback,
  Profile,
} from 'passport-google-oauth20';
import { ConfigService } from '../shared/config.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService, private authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    super({
      clientID: config.googleOAuthClientID,
      clientSecret: config.googleOAuthSecretKey,
      callbackURL: 'http://localhost:3030/api/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    } as StrategyOptionsWithRequest);
  }

  async validate(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _request: any,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      if (!profile) {
        throw new BadRequestException();
      }
      const email = profile.emails[0].value;
      const user = this.authService.validateOAuthLogin(
        email,
        profile.id,
        ThirdPartyProvider.GOOGLE,
      );
      done(undefined, user);
    } catch (err) {
      done(err, null);
    }
  }
}
