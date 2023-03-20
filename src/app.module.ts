import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { GamesModule } from './modules/games/games.module';
import { UtilsModule } from './utils/utils.module';
import { NagagamesModule } from './modules/nagagames/nagagames.module';

@Module({
  imports: [AuthModule, DatabaseModule, UtilsModule, GamesModule, NagagamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
