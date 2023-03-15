import { Module } from '@nestjs/common';
import { JwtHelper } from 'src/utils/jwt.helper';
import { UtilsModule } from 'src/utils/utils.module';
import { UserMapper } from './mapper/user.mapper';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  imports: [UtilsModule],
  controllers: [RegisterController],
  providers: [RegisterService, UserMapper, JwtHelper],
})
export class RegisterModule {}
