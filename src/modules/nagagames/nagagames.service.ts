import { BadRequestException, Injectable } from '@nestjs/common';
import { DbDocKeys } from '../../config/constants';
import axios from 'axios';
import * as uuid from 'uuid';
import { getObject, N1QL, upsertObject } from '../database/database.provider';
import { JwtTokenInterface } from 'src/interface/jwt.token.interface';
import { UserObject } from '../auth/register/interface/user.interface';
import {
  getErrorMessages,
  getSuccessMessages,
} from 'src/utils/language.helper';
import { hmacSHA256 } from '../../utils/crypto.helper';
import { AuthRequestDto } from './dto/player.info.dto';
import { generalAuth } from '../../utils/request.auth.helper';
import { UserWallet } from '../auth/register/interface/user.wallet.interface';
import { CreatePlayerRequestDto } from './dto/create.player.request.sto';
import { DepositeRequestDto } from './dto/deposite.request.dto';
import { WithdrawRequestDto } from './dto/withdraw.request.dto';

@Injectable()
export class NagagamesService {
  constructor() {}

  /**
   * User Authentication for seamless wallet
   * @param authRequestDto
   * @param req
   */
  async authorize(authRequestDto: AuthRequestDto, xSignature: string) {
    const query = `SELECT meta().id FROM default WHERE token='${authRequestDto.data.playerToken}'`;
    const result = await N1QL(query);
    const userId = result[0].id.split('::');

    const authorize = await generalAuth(authRequestDto, xSignature);

    if (authorize) {
      const wallet = (await getObject(`${userId[0]}::wallet`)) as UserWallet;
      return { nativeId: userId[0], ...wallet };
    }
    throw new BadRequestException(getErrorMessages().INVALID_AUTH);
  }

  /**
   * User Authentication for seamless wallet
   * @param req
   */
  async createPlayer(
    caller: JwtTokenInterface,
    createPlayerRequestDto: CreatePlayerRequestDto,
  ) {
    const user = (await getObject(
      `${caller.user_id}${DbDocKeys.USER}`,
    )) as UserObject;
    if (!user) {
      throw new BadRequestException(getErrorMessages().USER_NOT_EXIST);
    }

    const data = {
      nativeId: user.email,
      brandCode: createPlayerRequestDto.brandCode,
      groupCode: createPlayerRequestDto.groupCode,
      currencyCode: createPlayerRequestDto.currencyCode,
    };

    const signature = hmacSHA256(JSON.stringify(data), process.env.SECRET_KEY);

    const config = {
      url: `https://api.dev.game.topasianplatform.com/operator/transfer/create-player`,
      headers: { 'X-Signature': signature },
      data,
    };

    const res = await axios
      .post(config.url, config.data, {
        headers: config.headers,
      })
      .catch((error) => {
        throw new BadRequestException(error?.response?.data || error);
      });

    return user;
  }

  /**
   * Deposite money from source wallet to nagagames wallet
   * @param caller
   */
  async deposite(
    caller: JwtTokenInterface,
    depositeRequestDto: DepositeRequestDto,
  ) {
    const user = (await getObject(
      `${caller.user_id}${DbDocKeys.USER}`,
    )) as UserObject;
    if (!user) {
      throw new BadRequestException(getErrorMessages().USER_NOT_EXIST);
    }

    let wallet = (await getObject(
      `${caller.user_id}${DbDocKeys.WALLET}`,
    )) as UserWallet;

    if (depositeRequestDto.amount > wallet.balance) {
      throw new BadRequestException('Insufficient balance');
    }

    const nativeTransactionId = uuid.v4();
    const data = {
      nativeId: caller.user_id,
      brandCode: depositeRequestDto.brandCode,
      groupCode: depositeRequestDto.groupCode,
      currencyCode: wallet.currency,
      amount: Number(depositeRequestDto.amount),
      nativeTransactionId: nativeTransactionId,
    };
    const signature = hmacSHA256(JSON.stringify(data), process.env.SECRET_KEY);

    const config = {
      url: process.env.DEPOSITE,
      headers: { 'X-Signature': signature },
      data,
    };

    const res = await axios
      .post(config.url, config.data, {
        headers: config.headers,
      })
      .catch((error) => {
        throw new BadRequestException(error?.response?.data || error);
      });

    wallet.balance = wallet.balance - depositeRequestDto.amount;
    await upsertObject(`${caller.user_id}${DbDocKeys.WALLET}`, wallet);

    return res.data;
  }

  /**
   * Withdraw money from nagagames wallet to source wallet
   * @param caller
   * @param withdrawRequestDto
   */
  async withdraw(
    caller: JwtTokenInterface,
    withdrawRequestDto: WithdrawRequestDto,
  ) {
    const user = (await getObject(
      `${caller.user_id}${DbDocKeys.USER}`,
    )) as UserObject;
    if (!user) {
      throw new BadRequestException(getErrorMessages().USER_NOT_EXIST);
    }

    let wallet = (await getObject(
      `${caller.user_id}${DbDocKeys.WALLET}`,
    )) as UserWallet;

    const nativeTransactionId = uuid.v4();
    const data = {
      nativeId: caller.user_id,
      brandCode: withdrawRequestDto.brandCode,
      groupCode: withdrawRequestDto.groupCode,
      currencyCode: wallet.currency,
      amount: Number(withdrawRequestDto.amount),
      nativeTransactionId,
    };

    const signature = hmacSHA256(JSON.stringify(data), process.env.SECRET_KEY);
    const config = {
      url: process.env.WITHDRAW,
      headers: { 'X-Signature': signature },
      data,
    };

    const res = await axios
      .post(config.url, config.data, {
        headers: config.headers,
      })
      .catch((error) => {
        throw new BadRequestException(error?.response?.data || error);
      });

    wallet.balance += withdrawRequestDto.amount;
    await upsertObject(`${caller.user_id}${DbDocKeys.WALLET}`, wallet);

    return res.data;
  }

}
