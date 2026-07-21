import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@org/database';
import { JwtModule } from "@nestjs/jwt";
import { jwtConfig } from '@org/config';
import { ConfigModule, ConfigType } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule, 
    ConfigModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: {
          expiresIn: config.expiresIn
        }        
      }) 
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
