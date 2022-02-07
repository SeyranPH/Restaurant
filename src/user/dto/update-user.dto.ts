import {UserRole} from '../user.schema';

export interface UpdateUserDto {
    email?: string;
    name?: string;
    password?: string;
    role?: UserRole
}