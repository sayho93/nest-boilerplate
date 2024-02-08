import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthType, JwtPayload } from './auth.interface';
import { AuthRepository } from './auth.repository';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async validateEmail(signInDto: SignInDto) {
    const { type, email, password } = signInDto;
    if (type !== AuthType.EMAIL) return null;

    const auth = await this.repository.findOneByCondition({ where: { email }, relations: { user: true } });
    if (!auth) return null;

    const isMatch = await auth.compareHash(password);
    if (!isMatch) return null;

    return auth;
  }

  public async createToken(payload: JwtPayload) {
    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  public async findOneById(id: string) {
    return this.repository.findOneByCondition({ where: { id }, relations: { user: true } });
  }

  public async signOut(id: string) {
    return `This action removes a #${id} auth`;
  }
}
