import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String] },
  userType: { type: String },
  verifiedEmail: { type: Boolean }
})

@ObjectType()
export class User {
  @Field(() => String)
  email: string;

  @HideField()
  password: string;

  @Field(() => [String])
  roles: string[];

  @Field(() => String)
  userType: string;

  @Field(() => Boolean, { defaultValue: false })
  verifiedEmail: boolean;
}

// @Field(() => [ID])
// user: mongoose.Types.ObjectId[];