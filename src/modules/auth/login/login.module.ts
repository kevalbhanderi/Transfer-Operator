import { Module } from '@nestjs/common';
import { JwtHelper } from '../../../utils/jwt.helper';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService, JwtHelper]
})
export class LoginModule {}
