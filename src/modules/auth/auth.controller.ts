import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpRedirectResponse,
  HttpStatus,
  Post,
  Redirect,
  Res,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Auth } from './auth.entity';
import { AuthType } from './auth.interface';
import { AuthService } from './auth.service';
import { BypassAuth } from './decorators/auth.decorator';
import { CurrentAuth } from './decorators/current-auth.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ConfigsService } from '../configs/configs.service';
import { LoggerService } from '../logger/logger.service';

@Controller('auth')
export class AuthController {
  private readonly clientAuthRedirectURI: string;

  constructor(
    private readonly authService: AuthService,
    configsService: ConfigsService,
    private readonly loggerService: LoggerService,
  ) {
    this.clientAuthRedirectURI = configsService.App.clientURI + configsService.OAuth.clientAuthCallbackPath;
  }

  @BypassAuth()
  @Post('/signUp')
  public async signUp() {
    throw new ServiceUnavailableException('Not implemented');
  }

  @BypassAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post(`/signIn/${AuthType.EMAIL}`)
  public async signIn(@CurrentAuth() auth: Auth): Promise<Auth> {
    return this.authService.signIn(auth);
  }

  @BypassAuth()
  @UseGuards(GoogleAuthGuard)
  @Get(`/signIn/${AuthType.GOOGLE}`)
  public async signInWithGoogle(@CurrentAuth() auth: Auth): Promise<void> {
    this.loggerService.verbose(this.signInWithGoogle.name, auth);
  }

  @BypassAuth()
  @UseGuards(GoogleAuthGuard)
  @Redirect()
  @Get(`/signIn/${AuthType.GOOGLE}/redirect`)
  public async googleAuthRedirect(@CurrentAuth() auth: Auth): Promise<HttpRedirectResponse> {
    const authResult = await this.authService.signIn(auth);

    return {
      url: `${this.clientAuthRedirectURI}/${authResult.accessToken}?refresh_token=${authResult.refreshToken}`,
      statusCode: HttpStatus.FOUND,
    };
  }

  @BypassAuth()
  @UseGuards(JwtRefreshGuard)
  @Get(`/refresh`)
  public async refresh(@CurrentAuth() auth: Auth) {
    return this.authService.signIn(auth);
  }

  @Delete('/signOut')
  public async remove(@Res({ passthrough: true }) response: Response) {
    //TODO: blacklist token
    throw new ServiceUnavailableException('Not implemented');
  }
}
