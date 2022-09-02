import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResetPasswordToken {
    @Field(() => String)
    token: string;
}
