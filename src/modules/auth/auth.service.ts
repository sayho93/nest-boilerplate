import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Queue } from 'bullmq';
import { v4 } from 'uuid';
import { EMAIL_VERIFICATION_TIMEOUT } from './auth.constant';
import { AuthType, JwtPayload } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { createHash, isSameHash } from './auth.util';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Auth } from './entities/auth.entity';
import { CashKeys, GENERAL_CACHE } from '../cache/cache.constant';
import { CacheService } from '../cache/cache.service';
import { ConfigsService } from '../configs/configs.service';
import { Transactional } from '../database/transactional.decorator';
import { MailQueueOps } from '../mail/mail.constant';
import { InjectMailQueue } from '../queue/queue.decorator';
import { User } from '../users/entities/user.entity';
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
    @InjectMailQueue() private readonly mailQueue: Queue<ISendMailOptions, void>,
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
    if (!auth.user) throw new InternalServerErrorException('invalid data format');

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
  public async signUp(signUpDto: SignUpDto) {
    const { email, password, phone, lastName, firstName, alias } = signUpDto;

    const auth = await this.repository.findOneByCondition({
      where: { email, type: AuthType.EMAIL },
      relations: { user: true },
    });

    if (auth) {
      throw new BadRequestException('already exists');
    }

    return await this.createAuth({
      type: AuthType.EMAIL,
      email,
      password,
      phone,
      firstName,
      lastName,
    });
  }

  @Transactional()
  private async validateEmail(signInDto: SignInDto) {
    const { email, type } = signInDto;
    const auth = await this.repository.findOneByCondition({
      where: { email, type },
      relations: { user: true },
    });
    if (!auth) throw new UnauthorizedException('authentication not found');

    console.log(auth);
    if (!signInDto.password) throw new UnauthorizedException('password is required');
    const isMatch = await auth.compareHash(signInDto.password);
    if (!isMatch) throw new UnauthorizedException('authentication failed');

    return auth;
  }

  @Transactional()
  private async sendEmailVerification(auth: Auth) {
    if (!auth.user) if (!auth.user) throw new InternalServerErrorException('invalid data format');

    const verificationCode = v4();

    await Promise.all([
      this.cacheService.setEmailVerification(
        CashKeys.EMAIL_VERIFICATION + auth.user.id,
        { email: auth.email, code: await createHash(verificationCode) },
        EMAIL_VERIFICATION_TIMEOUT,
      ),

      this.mailQueue.add(MailQueueOps.SEND_SINGLE, {
        to: auth.email,
        subject: 'verification',
        template: 'activation_code.html',
        context: {
          code: verificationCode,
          username: `${auth.user.firstName} ${auth.user.lastName}`,
        },
      }),
    ]);
  }

  @Transactional()
  private async findUserByEmailOrCreate(signInDto: SignInDto): Promise<User> {
    const { email, firstName, lastName, phone } = signInDto;

    const authWithMatchingEmail = await this.repository.findOneByCondition({
      where: { email },
      order: { createdAt: -1 },
      relations: { user: true },
    });

    // 유저가 존재할 경우 즉시 반환
    if (authWithMatchingEmail?.user) return authWithMatchingEmail.user;

    if (!firstName || !lastName) {
      throw new UnauthorizedException('provided information is not enough');
    }

    return this.usersService.create({
      firstName: firstName,
      lastName: lastName,
      role: UserRole.GUEST,
      phone: phone || null,
      alias: `${firstName} ${lastName}`,
    });
  }

  @Transactional()
  private async createAuth(signInDto: SignInDto) {
    const { email, password, type, accessToken, refreshToken } = signInDto;

    const auth = new Auth(type);
    auth.email = email;
    auth.user = await this.findUserByEmailOrCreate(signInDto);

    if (type === AuthType.EMAIL) {
      if (!password) throw new BadRequestException('password is required');

      auth.isVerified = false;
      await auth.setPassword(password);
      await this.sendEmailVerification(auth);
    } else {
      if (!accessToken) throw new UnauthorizedException('provided information is not enough');
      auth.token = accessToken;
    }

    return await this.repository.create(auth);
  }

  @Transactional()
  private async validateOAuth(signInDto: SignInDto) {
    const { email, type } = signInDto;
    const auth = await this.repository.findOneByCondition({
      where: { email, type },
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
  public async resendEmailVerification(payload: JwtPayload) {
    const auth = await this.repository.findOneByCondition({
      where: { user: { id: payload.userId }, type: AuthType.EMAIL },
      relations: { user: true },
    });
    if (!auth) throw new NotFoundException('auth not found');

    if (auth.isVerified) throw new BadRequestException('already verified');

    return this.sendEmailVerification(auth);
  }

  @Transactional()
  public async verifyEmail(payload: JwtPayload, code: string) {
    const emailVerificationCache = await this.cacheService.getEmailVerification(
      CashKeys.EMAIL_VERIFICATION + payload.userId,
    );
    if (!emailVerificationCache) throw new BadRequestException('code not found');

    const isMatch = await isSameHash(code, emailVerificationCache.code);
    if (!isMatch) throw new BadRequestException('code does not match');

    return this.repository.updateOne(payload.authId, { isVerified: true });
  }

  @Transactional()
  public async signOut(id: string) {
    return `This action removes a #${id} auth`;
  }
}
