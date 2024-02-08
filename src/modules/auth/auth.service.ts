import { Injectable } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  public async signIn(signInDto: SignInDto) {}

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  public async signOut(id: string) {
    return `This action removes a #${id} auth`;
  }
}
