import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './auth.entity';
import { AuthType, JwtPayload } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { SignInDto } from './dto/sign-in.dto';
import { Transactional } from '../../common/decorators/transactional.decorator';
import { User } from '../users/user.entity';
import { UserRole } from '../users/users.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @Transactional()
  public async signIn(auth: Auth) {
    const payload: JwtPayload = {
      authId: auth.id,
      userId: auth.user.id,
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
      role: auth.user.role,
    };

    const tokens = await this.createToken(payload);

    auth.accessToken = tokens.accessToken;

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

    if (!auth) {
      return this.createAuth(signInDto);
    }

    // const payload: JwtPayload = {
    //   authId: auth.id,
    //   userId: auth.user.id,
    //   firstName: auth.user.firstName,
    //   lastName: auth.user.lastName,
    //   role: auth.user.role,
    // };
    // const tokens = await this.createToken(payload);
    // auth.accessToken = tokens.accessToken;

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

  public async createToken(payload: JwtPayload) {
    return { accessToken: await this.jwtService.signAsync(payload) };
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
