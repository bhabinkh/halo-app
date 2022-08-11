import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'

// export const UserSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   roles: { type: [String] },
//   userType: { type: String },
//   verifiedEmail: { type: Boolean }
// })

@Schema()
export class User {
  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: String, default: "H@l0Password" })
  password: string;

  @Prop({ type: [String] })
  roles: string[];

  @Prop({ type: String })
  userType: string;

  @Prop({ type: Boolean, default: false })
  verifiedEmail: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// @Field(() => [ID])
// user: mongoose.Types.ObjectId[];