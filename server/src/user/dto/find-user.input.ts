import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class FindUserInput {
  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  skip: number;

  @Field(() => String)
  userType: string;
}
