import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class Player {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  playerToken?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  betId?: string;
}

export class GeneralAuthRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  data: Player;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dataHash: string;
}
