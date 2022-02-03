import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { userInfo } from 'os';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private UserService: UserService) {

    }

    @Get()
    getAllUsers(): Promise<UserInterface[]> {
        return this.UserService.findAll();
    }

    @Get('/:id')
    async getUserById(@Param('id') id: string): Promise<UserInterface> {
        return await this.UserService.findById(id);
    }

    @Post()
    createUser(@Body() creatUserDto: CreateUserDto): Promise<UserInterface> {
        return this.UserService.create(creatUserDto);
    }
    
    @Patch('/:id')
    updateUserStatus(@Body() UpdateUserDto, @Param() id: string): Promise<UserInterface> {
        return this.UserService.update(id, UpdateUserDto);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string): void {
        this.UserService.delete(id);
    }
}

