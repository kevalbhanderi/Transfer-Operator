import { Module } from '@nestjs/common';
import { JwtHelper } from 'src/utils/jwt.helper';
import { NagagamesController } from './nagagames.controller';
import { NagagamesService } from './nagagames.service';

@Module({
  controllers: [NagagamesController],
  providers: [NagagamesService, JwtHelper],
})
export class NagagamesModule {}
