import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [DatabaseModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
