import { Field, ObjectType, ID, HideField } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'

export const FundraiserSchema = new mongoose.Schema({
    fundraiserName: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    requestAmount: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    approveStatus: { type: String, required: true },
    approvedDate: { type: Date, required: true },
    photoGallery: {}
})

@ObjectType()
export class Fundraiser extends mongoose.Document {
    @Field(() => ID)
    id: mongoose.Types.ObjectId;

    @Field()
    fundraiserName: string;

    @Field()
    requestAmount: string;

    @Field()
    startDate: Date;

    @Field()
    endDate: Date;

    @Field()
    approveStatus: string;

    @Field()
    approvedDate: Date;

    @Field()
    photoGallery: {}
}