import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './dto/user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt'
import { FindUserInput } from './dto/find-user.input';

const salt = 10
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async createUser(data: User): Promise<User> {
    data.password = await bcrypt.hash(data.password, salt)
    const newUser = await new this.userModel(data).save()
    return newUser
  }
  async listUser(data: FindUserInput): Promise<[User] | any> {
    return (data.userType) ? await this.userModel.find({ userType: data.userType }).limit(data.limit).skip(data.skip).exec()
      : await this.userModel.find({}).limit(data.limit).skip(data.skip).exec()
  }

  async getUser(email: string): Promise<User | any> {
    const user = await this.userModel.findOne({ email: email })
    return user
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec()
  }

  async updateUser(data: UpdateUserInput): Promise<User> {
    const user = await this.userModel.findOne({ email: data.email })
    if (!user) return
    const roles = (data.roles) ? data.roles : user.roles
    const userType = (data.userType) ? data.userType : user.userType
    const verifiedEmail = (data.verifiedEmail) ? data.verifiedEmail : user.verifiedEmail

    const updateUser = await this.userModel.findByIdAndUpdate(user.id, { roles: roles, userType: userType, verifiedEmail: verifiedEmail })
    return updateUser;
  }

  removeUser(id: number) {
    return `This action removes a #${id} user`;
  }



}
