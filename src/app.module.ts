import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './shared/config.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, AuthModule, ConfigModule],
})
export class AppModule {}
