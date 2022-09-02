import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FindUserInput {
    @Field(() => String)
    email: string;
}

