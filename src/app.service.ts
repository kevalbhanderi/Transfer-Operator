import { Injectable } from '@nestjs/common';
import { cbConnect } from './modules/database/database.provider';

@Injectable()
export class AppService {
  constructor() {
    cbConnect();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
