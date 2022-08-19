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

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

  ) { }

  @Mutation(() => Tokens)
  async loginUser(@Args('data') data: CreateAuthInput): Promise<Tokens> {
    const user = await this.userService.getUserByEmail(data.email)
    if (!user) throw new UnauthorizedException("Invalid Credentials")

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (!passwordMatch) throw new UnauthorizedException("Invalid credentials")

    if (!user.verifiedEmail) throw new PreconditionFailedException("User not registered")

    try {
      const tokens = await this.authService.loginUser(data.email)
      if (tokens) return tokens
    }
    catch (err) {
      throw new InternalServerErrorException("Error in login")
    }
  }

  @Mutation(() => Tokens)
  async refreshToken(@Args('token') refreshToken: string): Promise<Tokens> {
    const payload = await this.jwtService.verifyAsync(refreshToken, { secret: jwtConstants.secret })

    const user = await this.userService.getUserByEmail(payload.email)
    if (!user || !user.refreshToken) throw new ForbiddenException("Unauthorized: Access Denied")

    const refreshTokenMatch = await bcrypt.compare(refreshToken, user.refreshToken)
    if (!refreshTokenMatch) throw new ForbiddenException("Unauthorized: Access Denied")
    try {
      const tokens = await this.authService.refreshToken(payload.email)
      if (tokens) return tokens
    }
    catch (err) {
      throw new InternalServerErrorException("Error in login")
    }
  }

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
