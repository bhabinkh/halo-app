import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenerateOtp {
    @Field(() => String)
    otp: string;
}
