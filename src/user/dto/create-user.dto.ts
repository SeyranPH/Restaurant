import {UserRole} from '../user.schema';

export interface CreateUserDto {
    name: string;
    role: UserRole
}