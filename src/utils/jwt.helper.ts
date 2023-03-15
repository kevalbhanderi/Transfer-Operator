import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { DbDocKeys } from '../config/constants';
import { getObject } from '../modules/database/database.provider';
import { JwtTokenInterface } from '../interface/jwt.token.interface';

@Injectable()
export class JwtHelper {
  generateToken(tokenDto: JwtTokenInterface): string {
    const token = jwt.sign(tokenDto, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRED_TIME,
    });
    return token;
  }

  async verify(token: string): Promise<false | JwtTokenInterface> {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as JwtTokenInterface;
      const userSession = await getObject(`${token}${DbDocKeys.TOKEN}`);
      if (!userSession) {
        return false;
      }
      return { user_id: payload.user_id };
    } catch (e) {
      return false;
    }
  }

  getTokenFromHeader(request: Request): string {
    let token = request.headers['x-access-token'] as string;

    if (token && token.startsWith('Bearer ')) {
      // Remove Bearer from string
      return (token = token.slice(7, token.length));
    }
    return token;
  }
}
