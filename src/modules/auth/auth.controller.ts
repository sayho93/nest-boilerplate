import { Controller, Post, Delete, UseGuards, Res, HttpStatus, HttpCode, Req, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { Auth } from './auth.entity';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
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
  @Post('/signIn/email')
  public async signIn(@Req() request: Request) {
    // const token = await this.authService.createToken(payload);
    // const expires = new Date();
    // expires.setSeconds(expires.getSeconds() + this.configsService.App.jwtExpire);
    //
    // response.cookie('Authentication', token, { httpOnly: true, expires });
    // response.send(payload);

    return this.authService.signIn(request.auth!);
  }

  @BypassAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleAuthGuard)
  @Get('/signIn/google')
  public async signInWithGoogle(
    @Req() request: Request,
    @CurrentAuth() auth: Auth,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(auth);
    console.log(request.body);
    // const token = await this.authService.createToken(payload);
  }

  @BypassAuth()
  @UseGuards(GoogleAuthGuard)
  @Get('/signIn/google/redirect')
  public async googleAuthRedirect(@Req() request: Request) {
    return this.authService.signIn(request.auth!);
  }

  @BypassAuth()
  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  public async googleOAuth(@Req() request: Request) {}

  @Delete('/signOut')
  public async remove(@Res({ passthrough: true }) response: Response) {
    response.cookie('Authentication', null, { httpOnly: true, expires: new Date() });
  }
}
