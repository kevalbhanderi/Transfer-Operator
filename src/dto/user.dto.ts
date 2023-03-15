import { ApiProperty } from '@nestjs/swagger';
import { UserObject } from '../modules/auth/register/interface/user.interface';

export class UserDto {
  @ApiProperty()
  readonly userId: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly userName: string;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly lastName: string;

  constructor(user: UserObject, userId: string, token?: string) {
    this.userId = userId;
    this.email = user.email;
    this.userName = user.user_name;
    this.firstName = user.first_name;
    this.lastName = user.last_name;
  }
}
