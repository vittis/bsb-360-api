import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UserRO {
  id: string;
  created_at: Date;
  email: string;
}

export class UserAuthRO {
  user: UserRO;
  token: string;
  refreshToken: string;
}

export interface JWTPayload {
  email: string;
  id: string;
  iat?: number;
  expiresIn?: string;
}
