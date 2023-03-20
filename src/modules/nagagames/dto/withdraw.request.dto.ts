import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WithdrawRequestDto {
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
