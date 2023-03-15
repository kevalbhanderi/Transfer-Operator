import { Controller, Get, Post } from '@nestjs/common';
import { getObject, upsertObject } from './modules/database/database.provider';

@Controller()
export class AppController {
  @Get('/api/v1/ping')
  ping() {
    return { isError: false, data: {}, message: 'pong' };
  }
}
