import { Injectable } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<UserDocument>, 
        @InjectConnection() private connection: Connection
    ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.UserModel(createUserDto);
    return createdUser.save();
  }

  async findById(userId): Promise<User> {
    return await this.UserModel.findOne({id: userId});
  }

  async findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }

  async update(userId, fieldsToUpdate): Promise<User> {
    return await this.UserModel.findOneAndUpdate({id: userId}, fieldsToUpdate);
  }

  async delete(userId): Promise<void> {
    await this.UserModel.findOneAndDelete({id: userId});
    return;
  }
}