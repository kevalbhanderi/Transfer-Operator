import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [DatabaseModule, UtilsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
