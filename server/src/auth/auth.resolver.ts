import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { Tokens } from './dto/token.dto';
import { ForbiddenException, InternalServerErrorException, PreconditionFailedException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from 'src/common/helper/jwtConstants';
import { EmailVerification } from './dto/email-verification.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

  ) { }

  @Mutation(() => Tokens)
  async loginUser(@Args('data') data: CreateAuthInput): Promise<Tokens> {
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
  createAuth(@Args('createAuthInput') createAuthInput: CreateAuthInput) {
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
