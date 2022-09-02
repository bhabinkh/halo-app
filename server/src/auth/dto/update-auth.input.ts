import { AuthInput } from './auth.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAuthInput extends PartialType(AuthInput) {
  @Field(() => Int)
  id: number;
}
