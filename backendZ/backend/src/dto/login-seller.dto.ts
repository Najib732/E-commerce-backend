import { IsNumber, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginSellerDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  phone: number;  

  @IsString()
  @MinLength(6)
  password: string;
}
