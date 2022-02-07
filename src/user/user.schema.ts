import { Document, Schema, model } from 'mongoose';

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    emailConfirmed: {
        type: String,
        required: true,
        default: false
    },
    role: {
        type: String,
        enum: ["CLIENT", "OWNER"],
        default: "CLIENT",
        required: true
    },
    password: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: false
    },
    emailConfirmationToken: {
        type: String,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    }
},
{ timestamps: true },
);

export const User = model('User', UserSchema);

export interface UserInterface {
    name: string;
    email: string;
    emailConfirmed?: boolean
    id: string;
    role: UserRole;
    password?: string;
    accessToken?: string;
    emailConfirmationToken?: string;
    resetPasswordToken?: string;
}

export enum UserRole {
    OWNER = 'OWNER',
    CLIENT = 'CLIENT'
}
