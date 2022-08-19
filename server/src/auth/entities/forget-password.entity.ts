import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class EmailVerification {

    @Prop({ type: String, unique: true })
    email: string;

    @Prop({ type: String, default: "H@l0Password" })
    emailToken: string;

    @Prop({ type: Date })
    timestamp: Date;

}

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);