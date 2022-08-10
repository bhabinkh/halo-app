import { InputType, Int, Field } from '@nestjs/graphql';

export class CreateUserDto {
    @Field(() => String, { description: 'Example field (placeholder)' })
    email: string;

    @Field(() => String, { defaultValue: 'H@l0Password' })
    password: string;

    @Field(() => [String])
    roles?: string[];

    @Field(() => String)
    userType?: string;

    @Field(() => Boolean)
    verifiedEmail?: boolean;
}
