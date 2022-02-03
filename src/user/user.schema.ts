import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({required: true})
    name: string;

    @Prop()
    id: string;

    @Prop({required: true})
    role: UserRole;

    @Prop({required: true})
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export interface UserInterface {
    name: string;
    id: string;
    role: UserRole;
    password: string;
}

export enum UserRole {
    ADMIN = 'ADMIN',
    OWNER = 'OWNER',
    REGULAR = 'REGULAR'
}
