import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChangePasswordInput {
    @Field(() => String)
    email: string;

    @Field(() => String)
    token: string;

    @Field(() => String)
    password: string;
}

