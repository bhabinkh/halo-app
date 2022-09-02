import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ForgetPasswordTokens {
    @Field(() => String)
    token: string;

    @Field()
    accessToken: string;
}
