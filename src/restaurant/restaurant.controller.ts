import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantInterface } from './Restaurant.schema';
import { RestaurantService } from './Restaurant.service';

@Controller('restaurant')
export class RestaurantController {
    constructor(private RestaurantService: RestaurantService) {

    }

    @Get()
    getAllRestaurants(): Promise<RestaurantInterface[]> {
        return this.RestaurantService.findAll();
    }

    @Get('/:id')
    async getRestaurantById(@Param('id') id: string): Promise<RestaurantInterface> {
        return await this.RestaurantService.findById(id);
    }

    @Post()
    createRestaurant(@Body() creatRestaurantDto: CreateRestaurantDto): Promise<RestaurantInterface> {
        return this.RestaurantService.create(creatRestaurantDto);
    }
    
    @Patch('/:id')
    updateRestaurantStatus(@Body() UpdateRestaurantDto: UpdateRestaurantDto, @Param() id: string): Promise<RestaurantInterface> {
        return this.RestaurantService.update(id, UpdateRestaurantDto);
    }

    @Delete('/:id')
    deleteRestaurant(@Param('id') id: string): void {
        this.RestaurantService.delete(id);
    }
}
