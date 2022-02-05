import { Injectable } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { Restaurant, RestaurantDocument } from './restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectModel(Restaurant.name) private RestaurantModel: Model<RestaurantDocument>, 
        @InjectConnection() private connection: Connection
    ){}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const createdRestaurant = new this.RestaurantModel(createRestaurantDto);
    return createdRestaurant.save();
  }

  async findById(RestaurantId): Promise<Restaurant> {
    return await this.RestaurantModel.findOne({id: RestaurantId});
  }

  async findAll(): Promise<Restaurant[]> {
    return this.RestaurantModel.find().exec();
  }

  async update(RestaurantId, fieldsToUpdate): Promise<Restaurant> {
    return await this.RestaurantModel.findOneAndUpdate({id: RestaurantId}, fieldsToUpdate);
  }

  async delete(RestaurantId): Promise<void> {
    await this.RestaurantModel.findOneAndDelete({id: RestaurantId});
    return;
  }
}
