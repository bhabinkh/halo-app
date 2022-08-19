import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { objTrim } from 'src/common/helper/object-trim';
import { BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { validEmail, validPassword } from 'src/common/validation/validation';
import { User } from './dto/user.dto';

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

  @Query(() => [User], { name: 'user' })
  listUser() {
    return this.userService.listUser();
  }

  @Query(() => User, { name: 'user' })
  getUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.getUser(id);
  }

  @Query(() => User, { name: 'user' })
  getUserByEmail(@Args('email', { type: () => String }) email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput.id, updateUserInput);
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
