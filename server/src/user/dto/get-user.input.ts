import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class GetUserInput {
    @Field(() => String)
    email: string;

}
