import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '../../../dto/user.dto';
import { TransformInterceptor } from '../../../dispatchers/trsnsform.interceptor';
import { RegisterDto } from './dto/register.dto';
import { RegisterService } from './register.service';
import { SuccessResponse } from '../../../interface/success.response.interface';

@Controller('/api/v1')
@ApiTags('Register')
@UseInterceptors(TransformInterceptor)
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @ApiOperation({ summary: 'Register into the system' })
  @ApiOkResponse({ description: 'Success', type: UserDto })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<SuccessResponse<UserDto>> {
    const { data, message } = await this.registerService.register(registerDto);
    return { data, message };
  }
}
