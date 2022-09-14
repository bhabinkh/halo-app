import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { objTrim } from 'src/common/helper/object-trim';
import { BadRequestException, ForbiddenException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { validEmail, validPassword } from 'src/common/validation/validation';
import { User } from './dto/user.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { GqlAuthGuard } from 'src/common/guard/gql-auth.guard';
import { FindUserInput } from './dto/find-user.input';
import { CurrentUser } from 'src/common/guard/current-user-auth.guard';
import { GetUserInput } from './dto/get-user.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Mutation(() => User)
  async createUser(@Args('data') createUserInput: CreateUserInput): Promise<User> {
    const roles = ['user']
    const userType = 'user'
    const verifiedEmail = false
    const data = objTrim({ ...createUserInput, roles, userType, verifiedEmail })

    if (validEmail(data.email) && validPassword(data.password)) {
      const userFromDB = await this.userService.getUserByEmail(data.email)
      console.log(userFromDB)

      if (!userFromDB) return await this.userService.createUser(data);
      else if (!userFromDB.verifiedEmail) {
        throw new ForbiddenException("Registration: User not verified.")
      } else {
        throw new ForbiddenException("Registration: User registered already.")
      }
    } else {
      throw new BadRequestException("Registration: Invalid credentials")
    }
  }

  @Mutation(() => User)
  async createModeratorUser(@Args('data') createUserInput: CreateUserInput): Promise<User> {
    const roles = ['user, moderator']
    const userType = 'moderator'
    let verifiedEmail = true
    const data = objTrim({ ...createUserInput, roles, userType, verifiedEmail })

    if (validEmail(data.email) && validPassword(data.password)) {
      const userFromDB = await this.userService.getUserByEmail(data.email)
      console.log(userFromDB)

      if (!userFromDB) return await this.userService.createUser(data);
      else if (!userFromDB.verifiedEmail) {
        throw new ForbiddenException("Registration: User not verified.")
      } else {
        throw new ForbiddenException("Registration: User registered already.")
      }
    } else {
      throw new BadRequestException("Registration: Invalid credentials")
    }
  }

  @Mutation(() => User)
  async createAdminUser(@Args('data') createUserInput: CreateUserInput): Promise<User> {
    const roles = ['user, moderator, admin']
    const userType = 'admin'
    let verifiedEmail = true
    const data = objTrim({ ...createUserInput, roles, userType, verifiedEmail })

    if (validEmail(data.email) && validPassword(data.password)) {
      const userFromDB = await this.userService.getUserByEmail(data.email)
      console.log(userFromDB)

      if (!userFromDB) return await this.userService.createUser(data);
      else if (!userFromDB.verifiedEmail) {
        throw new ForbiddenException("Registration: User not verified.")
      } else {
        throw new ForbiddenException("Registration: User registered already.")
      }
    } else {
      throw new BadRequestException("Registration: Invalid credentials")
    }
  }

  @UseGuards(GqlAuthGuard)
  @Roles('admin')
  @Query(() => [User])
  async listUser(@Args('data') data: FindUserInput): Promise<[User] | any> {
    const users = await this.userService.listUser(data);
    if (users) return users
    else throw new BadRequestException("Authorization: Invalid")
  }

  @UseGuards(CurrentUser)
  @Query(() => User)
  async getUser(@Args('data') data: GetUserInput): Promise<User | any> {
    const user = await this.userService.getUser(data.email);
    if (user) return user
    else throw new BadRequestException("Authorization: Invalid")
  }

  @Query(() => User, { name: 'user' })
  getUserByEmail(@Args('email', { type: () => String }) email: string) {
    return this.userService.getUserByEmail(email);
  }

  @UseGuards(GqlAuthGuard)
  @Roles('admin')
  @Mutation(() => User)
  async updateUser(@Args('data') data: UpdateUserInput): Promise<User> {
    const user = await this.userService.updateUser(data);
    if (user) return user
    else throw new BadRequestException("Authorization: Invalid")
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.removeUser(id);
  }

  // const createUser = 

  // if (validEmail(data.email) && validPassword(data.password)) {
  //   const userFromDB = await this.userService.getUserByEmail(data.email)
  //   console.log(userFromDB)

  //   if (!userFromDB) return await this.userService.createUser(data);
  //   else if (!userFromDB.verifiedEmail) {
  //     throw new ForbiddenException("Registration: User not verified.")
  //   } else {
  //     throw new ForbiddenException("Registration: User registered already.")
  //   }
  // } else {
  //   throw new BadRequestException("Registration: Invalid credentials")
  // }

}
