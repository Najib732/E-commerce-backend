import { IsNumber } from "class-validator";

export class UpdateOrderDto {
    @IsNumber()
    orderId: number;
    items: { productId: number; quantity: number }[];
}
