import { Schema, model } from 'mongoose';
import { UserInterface, User } from 'src/user/user.schema';

const RestaurantSchema: Schema = new Schema(
    {
      onwerId: {
        type: Schema.Types.ObjectId,
        ref: User,
      },
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true
      },
      image: {
          type: String,
          required: true
      },
      location: {
          type: String,
          required: true
      }
    },
    { timestamps: true },
  );

export const Restaurant = model('Restaurant', RestaurantSchema);

export interface RestaurantInterface {
    id: string;
    ownerId: string | UserInterface;
    name: string;
    description: string;
    image: string;
    location: string;
}
