import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './auth.entity';
import { AuthType, JwtPayload } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { createHash } from './auth.util';
import { SignInDto } from './dto/sign-in.dto';
import { CashKeys, GENERAL_CACHE } from '../cache/cache.constant';
import { CacheService } from '../cache/cache.service';
import { ConfigsService } from '../configs/configs.service';
import { Transactional } from '../database/transactional.decorator';
import { User } from '../users/user.entity';
import { UserRole } from '../users/users.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly configsService: ConfigsService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @Inject(GENERAL_CACHE) private readonly cacheService: CacheService,
  ) {}

  private async setTokenToCache(userId: string, token: string) {
    await this.cacheService.set(CashKeys.TOKEN + userId, token, this.configsService.App.jwtRefreshExpire);
  }

  public async getTokenFromCacheOrThrow(userId: string) {
    const refreshToken = await this.cacheService.get(CashKeys.TOKEN + userId);
    if (!refreshToken) throw new UnauthorizedException('token not found');

    return refreshToken as string;
  }

  public async deleteTokenFromCache(userId: string) {
    await this.cacheService.del(CashKeys.TOKEN + userId);
  }

  @Transactional()
  public async signIn(auth: Auth) {
    const payload: JwtPayload = {
      authId: auth.id,
      userId: auth.user.id,
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
      role: auth.user.role,
    };

    const { accessToken, refreshToken } = await this.createTokens(payload);

    auth.accessToken = accessToken;
    auth.refreshToken = refreshToken;

    const hashedRefreshToken = await createHash(refreshToken);

    await this.setTokenToCache(auth.user.id, hashedRefreshToken);

    return auth;
  }

  @Transactional()
  private async validateEmail(signInDto: SignInDto) {
    const auth = await this.repository.findOneByCondition({
      where: { email: signInDto.email },
      relations: { user: true },
    });
    if (!auth) throw new UnauthorizedException('authentication not found');

    if (!signInDto.password) throw new UnauthorizedException('password is required');
    const isMatch = await auth.compareHash(signInDto.password);
    if (!isMatch) throw new UnauthorizedException('authentication failed');

    return auth;
  }

  @Transactional()
  private async createAuth(signInDto: SignInDto) {
    const authWithMatchingEmail = await this.repository.findOneByCondition({
      where: { email: signInDto.email },
      order: { createdAt: -1 },
    });

    const { email, firstName, lastName, type, accessToken, refreshToken } = signInDto;
    if (!firstName || !lastName || !accessToken) {
      throw new UnauthorizedException('provided information is not enough');
    }

    let user: User;

    if (!authWithMatchingEmail) {
      user = await this.usersService.create({
        firstName: firstName,
        lastName: lastName,
        role: UserRole.GUEST,
        phone: null,
        alias: `${firstName} ${lastName}`,
      });
    } else {
      user = authWithMatchingEmail.user;
    }

    const newAuth = new Auth(type);
    newAuth.email = email;
    newAuth.token = accessToken;
    newAuth.user = user;

    return await this.repository.create(newAuth);
  }

  @Transactional()
  private async validateOAuth(signInDto: SignInDto) {
    const auth = await this.repository.findOneByCondition({
      where: { email: signInDto.email, type: signInDto.type },
      relations: { user: true },
    });
    if (!auth) return this.createAuth(signInDto);

    return auth;
  }

  @Transactional()
  public async validate(signInDto: SignInDto): Promise<Auth> {
    switch (signInDto.type) {
      case AuthType.EMAIL:
        return this.validateEmail(signInDto);
      case AuthType.GOOGLE:
        return this.validateOAuth(signInDto);

      default:
        throw new UnauthorizedException('invalid auth type');
    }
  }

  public async createTokens(payload: JwtPayload) {
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: this.configsService.App.jwtRefreshSecret,
        expiresIn: this.configsService.App.jwtRefreshExpire,
      }),
    };
  }

  @Transactional()
  public async findOneById(id: string) {
    return this.repository.findOneByCondition({ where: { id }, relations: { user: true } });
  }

  @Transactional()
  public async signOut(id: string) {
    return `This action removes a #${id} auth`;
  }
}
