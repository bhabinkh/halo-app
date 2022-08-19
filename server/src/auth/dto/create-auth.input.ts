import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuthInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}

