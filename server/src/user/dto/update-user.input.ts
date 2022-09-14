import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => String)
  email: string;

  @Field(() => [String])
  roles?: string[];

  @Field(() => String)
  userType?: string;

  @Field(() => Boolean)
  verifiedEmail?: boolean;
}