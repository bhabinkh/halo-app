import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthOtpInput {
    @Field(() => String)
    email: string;

    @Field(() => String)
    otp: string;
}

