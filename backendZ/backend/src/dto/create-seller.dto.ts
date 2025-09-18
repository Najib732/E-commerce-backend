import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateSellerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phone: number;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

