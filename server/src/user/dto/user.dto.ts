import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => String)
    email: string;

    @HideField()
    password: string;

    @Field(() => [String])
    roles?: string[];

    @Field(() => String)
    userType?: string;

    @Field(() => Boolean)
    verifiedEmail?: boolean;

    @Field(() => String)
    refreshToken?: String
}
