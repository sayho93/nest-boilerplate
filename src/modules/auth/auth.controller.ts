import { Controller, Post, Delete, UseGuards, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { JwtPayload } from './auth.interface';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { BypassAuth } from '../../common/decorators/auth.decorator';
import { CurrentAuth } from '../../common/decorators/current-auth.decorator';
import { ConfigsService } from '../configs/configs.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configsService: ConfigsService,
  ) {}

  @BypassAuth()
  @Post('/signUp')
  public async signUp() {}

  @BypassAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/signIn')
  public async signIn(@CurrentAuth() payload: JwtPayload, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.createToken(payload);
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configsService.App.jwtExpire);

    response.cookie('Authentication', token, { httpOnly: true, expires });
    response.send(payload);
  }

  @Delete('/signOut')
  public async remove(@Res({ passthrough: true }) response: Response) {
    response.cookie('Authentication', null, { httpOnly: true, expires: new Date() });
  }
}
