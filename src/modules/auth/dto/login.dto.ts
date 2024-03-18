import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  /**
   * email of the user
   * @example 'sample1@gmail.com'
   */
  @IsEmail()
  email: string;

  /**
   * Password of the user
   * @example '123456'
   */
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
