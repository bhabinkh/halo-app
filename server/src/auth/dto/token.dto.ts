import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Tokens {
    @Field(() => String)
    refreshToken: string;

    @Field()
    accessToken: string;
}
