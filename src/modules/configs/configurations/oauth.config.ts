import * as process from 'process';
import { registerAs } from '@nestjs/config';
import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';
import { validateConfig } from './validation';

export class GoogleOAuth {
  @IsString()
  clientID: string;

  @IsString()
  clientSecret: string;

  @IsString()
  callbackURL: string;

  scope = ['email', 'profile'];

  prompt = 'none';
}

export class OAuth {
  @IsString()
  clientAuthCallbackPath: string;

  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => GoogleOAuth)
  google: GoogleOAuth;
}

export const OAuthConfig = registerAs(OAuth.name, (): InstanceType<typeof OAuth> => {
  const config = {
    clientAuthCallbackPath: process.env.OAUTH_CLIENT_AUTH_CALLBACK_PATH,
    google: {
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL,
    },
  };

  return validateConfig(OAuth, config);
});
