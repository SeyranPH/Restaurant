import {UserRole} from '../user.schema';

export interface CreateUserDto {
    name: string;
    password: string;
    role: UserRole
}