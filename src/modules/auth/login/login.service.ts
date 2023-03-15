import { BadRequestException, Injectable } from '@nestjs/common';
import { DbDocKeys } from '../../../config/constants';
import {
  getObject,
  upsertObject,
} from '../../../modules/database/database.provider';
import { JwtHelper } from '../../../utils/jwt.helper';
import { getErrorMessages } from '../../../utils/language.helper';
import { generateMD5Hash } from '../../../utils/password.helper';
import { UserObject } from '../register/interface/user.interface';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';

@Injectable()
export class LoginService {
  constructor(private readonly jwtHelper: JwtHelper) {}

  /**
   * User login through registered email & password
   * @param loginDto [email & password]
   */
  async login(loginDto: LoginRequestDto) {
    const user = (await getObject(
      `${loginDto.email}${DbDocKeys.USER}`,
    )) as UserObject;
    if (!user) {
      throw new BadRequestException(getErrorMessages().INVALID_CREDS);
    }

    const passwordHash = await generateMD5Hash(loginDto.password);
    if (passwordHash !== user.user_password) {
      throw new BadRequestException(getErrorMessages().INVALID_CREDS);
    }

    const tokenDto = { user_id: loginDto.email };
    const token = this.jwtHelper.generateToken(tokenDto);
    await upsertObject(`${token}${DbDocKeys.TOKEN}`, tokenDto);
    return new LoginResponseDto(user, user.email, token);
  }
}
