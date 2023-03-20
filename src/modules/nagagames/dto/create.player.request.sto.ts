import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsSemVer, IsString } from 'class-validator';

export class CreatePlayerRequestDto {
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
  @IsString()
  currencyCode: string;
}
