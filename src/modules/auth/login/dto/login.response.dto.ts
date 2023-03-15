import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../../../dto/user.dto';
import { UserObject } from '../../register/interface/user.interface';

export class LoginResponseDto extends UserDto {
  @ApiProperty()
  readonly token: string;

  constructor(user: UserObject, userId: string, token: string) {
    super(user, userId);

    this.token = token;
  }
}
