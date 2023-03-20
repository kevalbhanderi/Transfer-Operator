import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DbDocKeys } from '../../config/constants';
import { getErrorMessages } from '../../utils/language.helper';
import { JwtTokenInterface } from '../../interface/jwt.token.interface';
import * as _ from 'lodash';
import { getObject, upsertObject } from '../database/database.provider';
import { UserObject } from '../auth/register/interface/user.interface';
import { generatePlayerToken } from '../../utils/player.token.helper';
import { hmacSHA256 } from '../../utils/crypto.helper';

@Injectable()
export class GamesService {
  constructor() {}

  /**
   * List of all games
   * @param caller
   * @returns
   */
  async listGames(caller: JwtTokenInterface) {
    const userData = (await getObject(
      `${caller.user_id}${DbDocKeys.USER}`,
    )) as UserObject;
    if (!userData) {
      throw new BadRequestException(
        getErrorMessages(userData.language).USER_NOT_EXIST,
      );
    }
    const allGames = await axios.get(process.env.LIST_GAMES_URL, {
      params: {
        groupCode: process.env.GROUP_CODE,
        brandCode: process.env.BRAND_CODE,
      },
    });
    return allGames.data;
  }

  /**
   * To Open Game
   * @param caller
   * @returns
   */
  async openGame(caller: JwtTokenInterface) {
    const user = (await getObject(
      `${caller.user_id}${DbDocKeys.USER}`,
    )) as UserObject;
    if (!user) {
      throw new BadRequestException(
        getErrorMessages(user.language).USER_NOT_EXIST,
      );
    }

    const playerToken = await generatePlayerToken(30);
    await upsertObject(`${caller.user_id}${DbDocKeys.PLAYER_TOKEN}`, {
      token: playerToken,
    });
    const game = await axios.get(process.env.OPENING_GAME_URL, {
      params: {
        playerToken: playerToken,
        groupCode: process.env.GROUP_CODE,
        brandCode: process.env.BRAND_CODE,
        redirectUrl:
          'https%3A%2F%2Fapi-demo-operator.game-stg.topasianplatform.com',
        accept: 'text/plain',
      },
    });
    return game.data;
  }

  /**
   * Api to get player balance from NagaGames
   * @param caller
   * @returns
   */
  async NagaGamebalance(caller: JwtTokenInterface): Promise<{}> {
    // Get User Details
    const userData = (await getObject(
      `${caller.user_id}${DbDocKeys.USER}`,
    )) as UserObject;
    if (!userData) {
      throw new BadRequestException(
        getErrorMessages(userData.language).USER_NOT_EXIST,
      );
    }

    const data = {
      nativeId: caller.user_id,
      brandCode: process.env.TRANSFER_BRAND_CODE,
      groupCode: process.env.GROUP_CODE,
    };
    // Generate Signature
    const signature = hmacSHA256(JSON.stringify(data), process.env.SECRET_KEY);

    try {
      const wallet = await axios.get(process.env.NAGAGAMES_PLAYER_BALANCE, {
        params: {
          nativeId: caller.user_id,
          brandCode: process.env.TRANSFER_BRAND_CODE,
          groupCode: process.env.GROUP_CODE,
        },
        headers: {
          'X-Signature': signature,
        },
      });
      return wallet.data;
    } catch (e) {
      throw new BadRequestException(e?.response?.data || e);
    }
  }
}
