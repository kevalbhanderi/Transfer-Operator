import {
  IsEmail,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
  MinLength,
  IsLowercase,
  IsNumberString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ title: 'User unique email-id' })
  @IsEmail({}, { message: 'LOGIN_EMAIL' })
  @IsLowercase({ message: 'USER_EMAIL' })
  @IsNotEmpty({ message: 'LOGIN_EMAIL' })
  email: string;

  @ApiProperty({ title: 'User password' })
  @IsNotEmpty({ message: 'LOGIN_PASSWORD' })
  @MinLength(6, { message: 'WEAK_PASSWORD' })
  @MaxLength(24, { message: 'WEAK_PASSWORD' })
  @Matches(
    /^(?=.{6,})(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.+[`~()',;_\[\]|\\/.<>?:"{}@#$%^&+*!=-]).*$/,
    {
      message: 'WEAK_PASSWORD',
    },
  )
  password: string;

  @ApiProperty({ title: 'User name' })
  @IsString({ message: 'USER_NAME' })
  @MaxLength(12, { message: 'USER_NAME' })
  @IsNotEmpty({ message: 'EMPTY_USER_NAME' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'USER_NAME',
  })
  userName: string;

  @ApiPropertyOptional({ title: 'First name' })
  @IsString({ message: 'FIRST_NAME' })
  @IsOptional()
  @MaxLength(30, { message: 'FIRST_NAME' })
  firstName: string;

  @ApiPropertyOptional({ title: 'Last name' })
  @IsString({ message: 'LAST_NAME' })
  @IsOptional()
  @MaxLength(30, { message: 'LAST_NAME' })
  lastName: string;

  @ApiPropertyOptional({ title: 'Gender', enum: ['MALE', 'FEMALE'] })
  @IsOptional()
  @IsEnum(['MALE', 'FEMALE'])
  gender: string;

  @ApiPropertyOptional({ title: 'Phone number' })
  @IsOptional()
  @IsNumberString({}, { message: 'PHONE_NUMBER' })
  @MinLength(6, { message: 'PHONE_NUMBER' })
  @MaxLength(13, { message: 'PHONE_NUMBER' })
  phone: string;
}
