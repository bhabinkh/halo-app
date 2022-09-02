import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { AuthInput } from './dto/auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { Tokens } from './dto/token.dto';
import { ForbiddenException, InternalServerErrorException, PreconditionFailedException, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from 'src/common/helper/jwtConstants';
import { EmailVerification } from './dto/email-verification.input';
import { AuthOtpInput } from './dto/auth-otp.input';
import { ForgetPasswordTokens } from './dto/fp-token.dto';
import { ChangePasswordInput } from './dto/change-password.input';
import { GenerateOtp } from './dto/generate-otp.dto';
import { ResetPasswordToken } from './dto/rp-token.dto';
import { ChangePasswordStatus } from './dto/cp-status.dto';
import { User } from 'src/user/dto/user.dto';
import { FindUserInput } from './dto/find-user.input';
import { GqlAuthGuard } from 'src/common/guard/gql-auth.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

  ) { }

  // @UseGuards(GqlAuthGuard)
  // @Query(() => User)
  // findOneUser(@Args('data') data: FindUserInput) {
  //   return this.userService.getUserByEmail(data.email);
  // }

  @Mutation(() => Tokens)
  async loginUser(@Args('data') data: AuthInput): Promise<Tokens> {
    try {
      const tokens = await this.authService.loginUser(data)
      return tokens
    }
    catch (err) {
      console.log(err)
      throw new UnauthorizedException("Invalid Credentials")
    }
  }

  @Mutation(() => Tokens)
  async refreshToken(@Args('token') refreshToken: string): Promise<Tokens> {
    try {
      const tokens = await this.authService.refreshToken(refreshToken)
      if (!tokens) throw new ForbiddenException("Unauthorized: Access Denied")
      return tokens
    }
    catch (err) {
      throw new ForbiddenException("Unauthorized: Access Denied")
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ChangePasswordStatus)
  async changePassword(@Args('data') data: ChangePasswordInput): Promise<ChangePasswordStatus> {
    try {
      const changePassword = await this.authService.changePassword(data)
      return { status: changePassword.status }
    }
    catch (err) {
      console.log(err)
      throw new UnauthorizedException("Invalid Credentials")
    }
  }

  @Mutation(() => ResetPasswordToken)
  async resetPassword(@Args('data') data: AuthInput): Promise<ResetPasswordToken> {
    try {
      const token = await this.authService.resetPassword(data)
      return { token: token.token }
    }
    catch (err) {
      console.log(err)
      throw new UnauthorizedException("Invalid Credentials")
    }
  }

  @Mutation(() => ForgetPasswordTokens)
  async forgetPassword(@Args('data') data: AuthOtpInput): Promise<ForgetPasswordTokens> {
    try {
      const tokens = await this.authService.forgetPassword(data)
      return tokens
    }
    catch (err) {
      console.log(err)
      throw new UnauthorizedException("Invalid Credentials")
    }
  }

  @Mutation(() => GenerateOtp)
  async generateOtp(@Args('data') email: string): Promise<GenerateOtp> {
    try {
      const otp = await this.authService.generateOtp(email)
      return { otp: otp.otp }
    }
    catch (err) {
      console.log(err)
      throw new UnauthorizedException("Invalid Credentials")
    }
  }

  // @Mutation(() => String)
  // async verifyUser(@Args('data') data: EmailVerification): Promise<Boolean> {
  //   const user = await this.userModel.findOne({ email: data.email })

  //   if (user && user.emailToken) {
  //     if (user.emailToken === data.token) {
  //       await this.userModel.findOneAndUpdate({ email: data.email }, { verifiedEmail: true })
  //       return true
  //     }
  //   }
  //   let status = ''
  //   try {
  //     const verifyStatus = await this.authService.verifyEmail(data)
  //     if (verifyStatus) return true
  //   }
  //   catch (err) {
  //     throw new InternalServerErrorException("Error in login")
  //   }
  // }


  @Mutation(() => Auth)
  createAuth(@Args('createAuthInput') createAuthInput: AuthInput) {
    return this.authService.create(createAuthInput);
  }

  @Query(() => [Auth], { name: 'auth' })
  findAll() {
    return this.authService.findAll();
  }

  @Query(() => Auth, { name: 'auth' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authService.findOne(id);
  }

  @Mutation(() => Auth)
  updateAuth(@Args('updateAuthInput') updateAuthInput: UpdateAuthInput) {
    return this.authService.update(updateAuthInput.id, updateAuthInput);
  }

  @Mutation(() => Auth)
  removeAuth(@Args('id', { type: () => Int }) id: number) {
    return this.authService.remove(id);
  }
}
