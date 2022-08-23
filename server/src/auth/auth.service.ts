import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose';
import { User } from 'src/user/dto/user.dto';

import { CreateAuthInput } from './dto/create-auth.input';
import { Tokens } from './dto/token.dto';
import { UpdateAuthInput } from './dto/update-auth.input';
import { jwtConstants } from 'src/common/helper/jwtConstants';
import { EmailVerification } from './dto/email-verification.input';
import { UserService } from 'src/user/user.service';

let saltRounds = 10
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    // @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async logoutUser(email: string): Promise<boolean> {
    await this.userModel.findByIdAndUpdate({ email: email }, { refreshToken: null })
    return true
  }

  async loginUser(data: CreateAuthInput): Promise<Tokens> {
    const user = await this.userService.getUserByEmail(data.email)
    if (!user) return

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) return

    else {
      const payload = {
        userId: user.id,
        email: user.email
      }
      const tokens = await this.createTokens(payload)
      await this.updateRefreshToken(user.id, tokens.refreshToken)
      return tokens
    }
  }

  async createTokens(payload: any): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '15m',
      }),
      await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '90d',
      })
    ])
    return { accessToken, refreshToken }
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const hashRefreshToken = await bcrypt.hash(refreshToken, saltRounds)
    const newUser = await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashRefreshToken })
    await newUser.save()
    return true
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    const user = await this.jwtService.verifyAsync(refreshToken, { secret: jwtConstants.secret })
    const payload = { userId: user.userId, email: user.email }
    const tokens = await this.createTokens(payload)
    await this.updateRefreshToken(payload.userId, tokens.refreshToken)
    return tokens
  }

  // async verifyEmail(data: EmailVerification): Promise<Boolean> {
  //   const user = await this.userModel.findOne({ email: data.email })
  //   if (user && user.emailToken) {
  //     if (user.emailToken === data.token) {
  //       await this.userModel.findOneAndUpdate({ email: data.email }, { verifiedEmail: true })
  //       return true
  //     }
  //   }
  //   return false
  // }

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
