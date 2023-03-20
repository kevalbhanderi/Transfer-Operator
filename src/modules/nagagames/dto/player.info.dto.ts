import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsSemVer, IsString } from 'class-validator';

export class Player {
  @ApiProperty()
  playerToken: string;

  @ApiProperty()
  gameCode: string;

  @ApiProperty()
  brandCode: string;

  @ApiProperty()
  groupCode: string;
}

export class AuthRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  data: Player;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  dataHash: string;
}
