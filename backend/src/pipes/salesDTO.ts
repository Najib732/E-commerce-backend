import { IsNumber } from "class-validator";


export class salesDTO{
    
@IsNumber()
productId:number;
@IsNumber()
quantity:number;

}