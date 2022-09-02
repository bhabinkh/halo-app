import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose';
import { User } from 'src/user/dto/user.dto';

import { AuthInput } from './dto/auth.input';
import { Tokens } from './dto/token.dto';
import { UpdateAuthInput } from './dto/update-auth.input';
import { jwtConstants } from 'src/common/helper/jwtConstants';
import { UserService } from 'src/user/user.service';
import { AuthOtpInput } from './dto/auth-otp.input';
import { ForgetPasswordTokens } from './dto/fp-token.dto';
import { generateRandomNumber } from 'src/common/helper/generate-random-number';
import { ChangePasswordInput } from './dto/change-password.input';
import { GenerateOtp } from './dto/generate-otp.dto';
import { ResetPasswordToken } from './dto/rp-token.dto';
import { ChangePasswordStatus } from './dto/cp-status.dto';

let salt = 10
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

  async loginUser(data: AuthInput): Promise<Tokens> {
    const user = await this.userService.getUserByEmail(data.email)
    if (!user) return

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) return

    else {
      const payload = {
        userId: user.id,
        email: user.email,
        roles: user.roles
      }
      const tokens = await this.createTokens(payload)
      const updateRefreshToken = await this.updateRefreshToken(tokens.refreshToken)
      if (!updateRefreshToken) return
      return tokens
    }
  }

  async createTokens(payload: any): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: jwtConstants.at_secret,
        expiresIn: '15m',
      }),
      await this.jwtService.signAsync(payload, {
        secret: jwtConstants.rt_secret,
        expiresIn: '90d',
      })
    ])
    return { accessToken, refreshToken }
  }

  async updateRefreshToken(refreshToken: string): Promise<boolean> {
    const payload = await this.jwtService.verifyAsync(refreshToken, { secret: jwtConstants.rt_secret })
    const userId = payload.userId
    const timestamp = payload.iat.toString() + payload.exp.toString()

    const hashTimestamp = await bcrypt.hash(timestamp, salt)
    const newUser = await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashTimestamp })
    await newUser.save()
    return true
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    const payloadUser = await this.jwtService.verifyAsync(refreshToken, { secret: jwtConstants.rt_secret })
    const payload = { userId: payloadUser.userId, email: payloadUser.email, roles: payloadUser.roles }
    const user = await this.userService.getUserByEmail(payload.email)
    const timestamp = payloadUser.iat.toString() + payloadUser.exp.toString()

    const refreshTokenMatch = await bcrypt.compare(timestamp, user.refreshToken)
    if (!refreshTokenMatch) return

    const tokens = await this.createTokens(payload)
    const updateRefreshToken = await this.updateRefreshToken(tokens.refreshToken)
    if (!updateRefreshToken) return
    return tokens
  }

  async changePassword(data: ChangePasswordInput): Promise<ChangePasswordStatus> {
    const user = await this.userService.getUserByEmail(data.email)
    if (!user) return

    const tokenMatch = await bcrypt.compare(data.token, user.token)
    if (!tokenMatch) return
    else {
      const hashPassword = await bcrypt.hash(data.password, salt)
      const updatePassword = await this.userModel.findByIdAndUpdate(user.id, { password: hashPassword, token: null })
      return { status: !!updatePassword }
    }
  }

  async resetPassword(data: AuthInput): Promise<ResetPasswordToken> {
    const user = await this.userService.getUserByEmail(data.email)
    if (!user) return

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) return
    else {
      const timestamp = new Date().getTime().toString()
      const hashTimestamp = await bcrypt.hash(timestamp, salt)
      await this.userModel.findByIdAndUpdate(user.id, { token: hashTimestamp })
      return { token: timestamp }
    }
  }

  async forgetPassword(data: AuthOtpInput): Promise<ForgetPasswordTokens> {
    const user = await this.userService.getUserByEmail(data.email)
    if (!user) return

    const otpMatch = await bcrypt.compare(data.otp, user.otp)
    if (!otpMatch) return
    const payload = {
      userId: user.id,
      email: user.email,
      roles: user.roles
    }
    const tokens = await this.createTokens(payload)
    const timestamp = new Date().getTime().toString()
    const hashTimestamp = await bcrypt.hash(timestamp, salt)
    await this.userModel.findByIdAndUpdate(user.id, { token: hashTimestamp, otp: null })
    return { token: timestamp, accessToken: tokens.accessToken }
  }

  async generateOtp(email: string): Promise<GenerateOtp> {
    const user = await this.userService.getUserByEmail(email)
    if (!user) return
    else {
      let otpCreatedAt = new Date().getTime().toString()
      const otp = generateRandomNumber(6)
      const hashOtp = await bcrypt.hash(otp, salt)
      await this.userModel.findByIdAndUpdate(user.id, { otp: hashOtp, otpCreatedAt: otpCreatedAt })
      return { otp }
    }
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

  create(createAuthInput: AuthInput) {
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
