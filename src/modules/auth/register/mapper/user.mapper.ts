import { generateMD5Hash } from '../../../../utils/password.helper';
import { RegisterDto } from '../dto/register.dto';
import { UserObject } from '../interface/user.interface';
import { UserLevel } from '../interface/user.level.interface';
import { UserWallet } from '../interface/user.wallet.interface';

export class UserMapper {
  /**
   * Builds user basic data required to register
   */
  buildUser = async (payload: RegisterDto): Promise<UserObject> => {
    return {
      user_password: payload.password
        ? await generateMD5Hash(payload.password)
        : '',
      email: payload.email,
      user_name: payload.userName,
      first_name: payload.firstName || '',
      last_name: payload.lastName || '',
      created: Date.now(),
    };
  };

  /**
   * Builds user initial wallet amount
   */
  buildUserWallet = (): UserWallet => {
    return {
      balance: 10000,
      currency: 'INR',
    };
  };

  /**
   * builds user initial level data
   */
  buildUserLevel = (): UserLevel => {
    return {
      current_level: 1,
      next_level: 2,
    };
  };
}
