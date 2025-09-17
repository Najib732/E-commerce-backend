import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50, { message: "Username must be between 3 and 50 characters" })
  user_name: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  password: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{10,15}$/, { message: "Mobile number must be 10–15 digits" })
  mobile_no: string;

  @IsNotEmpty()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 100, { message: "Address must be between 5 and 100 characters" })
  address: string;

  @IsNotEmpty()
  @IsString()
  category: string;
}
