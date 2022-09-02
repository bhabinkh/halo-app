import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ChangePasswordStatus {
    @Field(() => Boolean)
    status: boolean;
}
