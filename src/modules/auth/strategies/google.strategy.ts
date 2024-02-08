import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigsService } from '../../configs/configs.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configsService: ConfigsService) {
    super(configsService.OAuth);
  }

  public async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.familyName,
      lastName: name.givenName,
      picture: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}
