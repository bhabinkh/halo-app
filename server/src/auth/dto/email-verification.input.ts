import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EmailVerification {
    @Field(() => String)
    email: string;

    @Field()
    token: string;
}
