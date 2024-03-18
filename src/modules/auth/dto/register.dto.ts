import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
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

  /**
   * Name of the user
   */
  name?: string;
}
