import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class DepositeRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nativeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  brandCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  groupCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
