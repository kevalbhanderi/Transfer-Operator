import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  getErrorMessages,
  getSuccessMessages,
} from '../../../utils/language.helper';
import { DbDocKeys } from '../../../config/constants';
import {
  getObject,
  insertObject,
  N1QL,
  upsertObject,
} from '../../../modules/database/database.provider';
import { RegisterDto } from './dto/register.dto';
import * as _ from 'lodash';
import { UserObject } from './interface/user.interface';
import { UserDto } from '../../../dto/user.dto';
import { UserMapper } from './mapper/user.mapper';
import { JwtHelper } from '../../../utils/jwt.helper';

@Injectable()
export class RegisterService {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly jwtHelper: JwtHelper,
  ) {}
  /**
   * It registers a user
   * Only unique emails are allowed
   * @param registerDto Required user details
   */
  async register(registerDto: RegisterDto) {
    const email = registerDto.email;
    const emailExists = (await getObject(
      `${email}${DbDocKeys.USER}`,
    )) as UserObject;
    if (emailExists) {
      throw new BadRequestException(
        getErrorMessages().EMAIL_ALREADY_REGISTERED,
      );
    }

    // To Check Unique Username
    const user_names = (await N1QL(
      `SELECT user_name FROM default WHERE Meta().id LIKE '%${DbDocKeys.USER}'`,
    )) as [{ user_name: string }];
    const userNameExists = _.find(user_names, {
      user_name: registerDto.userName,
    });
    if (userNameExists) {
      throw new BadRequestException(getErrorMessages().USERNAME_ALREADY_EXITS);
    }

    const userDetails = await this.buildAndSaveUser(registerDto);

    return {
      data: new UserDto(userDetails.user, email, userDetails.jwtToken),
      message: getSuccessMessages().USER_REGISTERED,
    };
  }

  /**
   * To fetch and store user details on registration
   * @param email
   * @param registerDto
   * @param referralCode
   */
  async buildAndSaveUser(
    registerDto: RegisterDto,
  ): Promise<{ user: UserObject; jwtToken: string }> {
    const tokenDto = { user_id: registerDto.email };

    // build user data
    const user = await this.userMapper.buildUser(registerDto);
    const wallet = this.userMapper.buildUserWallet();
    const level = this.userMapper.buildUserLevel();
    const jwtToken = this.jwtHelper.generateToken(tokenDto);

    Promise.all([
      await insertObject(`${registerDto.email}${DbDocKeys.USER}`, user),
      await insertObject(`${registerDto.email}${DbDocKeys.WALLET}`, wallet),
      await insertObject(`${registerDto.email}${DbDocKeys.LEVEL}`, level),
      await upsertObject(`${jwtToken}${DbDocKeys.TOKEN}`, tokenDto),
    ]).catch((e) => {
      throw new InternalServerErrorException(
        getErrorMessages().INTERNAL_SERVER_ERROR,
      );
    });

    return { user: user, jwtToken };
  }
}
