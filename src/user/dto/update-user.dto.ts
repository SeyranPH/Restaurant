import {UserRole} from '../user.schema';

export interface UpdateUserDto {
    name?: string;
    password?: string;
    role?: UserRole
}