import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginRequestDto {
  @ApiProperty({ title: 'email-id to log-in with' })
  @IsEmail({}, { message: 'LOGIN_EMAIL' })
  @IsNotEmpty({ message: 'LOGIN_EMAIL' })
  @Transform((value) => value.trim())
  email: string;

  @ApiProperty({ title: 'Corresponding password for email-id' })
  @IsNotEmpty({ message: 'LOGIN_PASSWORD' })
  @IsString({ message: 'LOGIN_PASSWORD' })
  @Transform((value) => value.trim())
  password: string;
}
