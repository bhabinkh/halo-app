import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose';
import { User } from 'src/user/dto/user.dto';

import { CreateAuthInput } from './dto/create-auth.input';
import { Tokens } from './dto/token.dto';
import { UpdateAuthInput } from './dto/update-auth.input';
import { jwtConstants } from 'src/common/helper/jwtConstants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    // @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) { }

  async logoutUser(email: string): Promise<boolean> {
    await this.userModel.findByIdAndUpdate({ email: email }, { refreshToken: null })
    return true
  }

  async loginUser(email: string): Promise<Tokens> {
    const tokens = await this.createTokens(email)
    await this.updateRefreshToken(email, tokens.refreshToken)
    return tokens
  }

  async createTokens(email: string): Promise<Tokens> {
    const payload = email

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '90d'
      })
    ])
    return { accessToken, refreshToken }
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<boolean> {
    const hashRefreshToken = await bcrypt.hash(refreshToken)
    await this.userModel.findOneAndUpdate({ email: email }, { refreshToken: hashRefreshToken })
    return true
  }

  async refreshToken(email: string): Promise<Tokens> {
    const tokens = await this.createTokens(email)

    await this.updateRefreshToken(email, tokens.refreshToken)
    return tokens
  }

  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
