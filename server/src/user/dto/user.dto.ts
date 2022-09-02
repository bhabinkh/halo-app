import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

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

    @Field(() => String)
    token?: String

    @Field(() => String)
    otp?: String

    @Field(() => String)
    otpCreatedAt?: String
}
