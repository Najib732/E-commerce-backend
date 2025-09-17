import { IsNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsNumber()
  userId: number;
  @IsString()
  
  password: string;
}

