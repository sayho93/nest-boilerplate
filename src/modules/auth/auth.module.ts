import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { Auth } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
