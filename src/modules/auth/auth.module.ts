import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { UserMapper } from './register/mapper/user.mapper';

@Module({
  controllers: [],
  providers: [UserMapper],
  imports: [RegisterModule, LoginModule],
})
export class AuthModule {}
