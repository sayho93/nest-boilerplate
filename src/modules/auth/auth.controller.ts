import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpRedirectResponse,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Res,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Auth } from './auth.entity';
import { AuthType } from './auth.interface';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { BypassAuth } from '../../common/decorators/auth.decorator';
import { CurrentAuth } from '../../common/decorators/current-auth.decorator';
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
  @Post('/signIn/email')
  public async signIn(@Req() request: Request): Promise<Auth> {
    return this.authService.signIn(request.auth!);
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
      url: `${this.clientAuthRedirectURI}/${authResult.accessToken}`,
      statusCode: HttpStatus.FOUND,
    };
  }

  @Delete('/signOut')
  public async remove(@Res({ passthrough: true }) response: Response) {
    //TODO: blacklist token
    throw new ServiceUnavailableException('Not implemented');
  }
}
