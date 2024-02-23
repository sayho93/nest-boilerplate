import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigsService } from '../configs/configs.service';

@Global()
@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory(configsService: ConfigsService) {
        const appConfig = configsService.App;
        return {
          secret: appConfig.jwtSecret,
          signOptions: {
            algorithm: appConfig.jwtAlgorithm,
            expiresIn: `${appConfig.jwtExpire}s`,
            allowInsecureKeySizes: false,
            audience: appConfig.clientURI,
            issuer: appConfig.jwtIssuer,
          },
        };
      },
      inject: [ConfigsService],
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}
