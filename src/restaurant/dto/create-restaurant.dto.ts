import { User } from "../../user/user.schema";

export interface CreateRestaurantDto {
    id: string;
    ownerId: string | User;
    name: string;
    description: string;
    image: string;
    location: string;
}
