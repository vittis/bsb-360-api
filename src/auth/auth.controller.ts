import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  Req,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDTO, RegisterDTO, UserAuthRO } from './auth.dto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtGuard } from './jwt.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<UserAuthRO> {
    return this.authService.login(loginDTO);
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<UserAuthRO> {
    return this.authService.register(registerDTO);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@Req() req: Request): Promise<{}> {
    //console.log('controller', req.user);
    return { user: req.user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<{}> {
    const user: UserAuthRO = req.user;

    try {
      if (user) {
        //@todo: remove hard coded url
        res.redirect(
          `http://localhost:3000/auth/google/success?token=${user.token}`,
        );
        return user;
      }
      throw new InternalServerErrorException('Login attempt failed');
    } catch (err) {
      return { err };
    }
  }
}
