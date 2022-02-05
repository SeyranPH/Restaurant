import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { User } from 'src/user/user.schema';

export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Restaurant {
    @Prop()
    id: string;

    @Prop()
    ownerId: string | User;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    description: string;

    @Prop()
    image: string;

    @Prop()
    location: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

export interface RestaurantInterface {
    id: string;
    ownerId: string | User;
    name: string;
    description: string;
    image: string;
    location: string;
}
