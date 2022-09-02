import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './dto/user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt'

const salt = 10
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async createUser(data: User): Promise<User> {
    data.password = await bcrypt.hash(data.password, salt)
    const newUser = await new this.userModel(data).save()
    return newUser
  }
  listUser() {
    return `This action returns all user`;
  }

  getUser(id: number) {

    return `This action returns a #${id} user`;
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec()
  }

  updateUser(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  removeUser(id: number) {
    return `This action removes a #${id} user`;
  }



}
