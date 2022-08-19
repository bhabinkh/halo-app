import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EmailVerification {
    @Field(() => String)
    email: string;

    @Field()
    token: string;
}
