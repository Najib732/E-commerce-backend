import { IsString, IsNumber, MinLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSellerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  phone: number;

  @IsString()
  @MinLength(6)
  password: string;
}
