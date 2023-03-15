import { Module } from '@nestjs/common';
import { JwtHelper } from 'src/utils/jwt.helper';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, JwtHelper],
})
export class GamesModule {}
