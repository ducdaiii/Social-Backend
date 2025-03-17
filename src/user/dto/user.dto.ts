import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ROLES } from 'src/common';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEmail()
  email: string;
}