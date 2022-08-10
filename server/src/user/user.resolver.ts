import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { objTrim } from 'src/common/helper/object-trim';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { validEmail, validPassword } from 'src/common/validation/validation';

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
      try {
        const userFromDB = await this.userService.getUserByEmail(data.email)
        console.log(userFromDB)
        if (!userFromDB) return await this.userService.createUser(data);
        else if (!userFromDB.verifiedEmail) return userFromDB
        else throw new ForbiddenException("Registration: User already registered")
      } catch (err) {
        throw new InternalServerErrorException("Internal Server Error")
      }
    } else {
      throw new ForbiddenException("Registration: Invalid credentials")
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

}
