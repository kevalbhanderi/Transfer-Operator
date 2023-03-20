import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { NagagamesService } from './nagagames.service';
import { JwtTokenInterface } from 'src/interface/jwt.token.interface';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthRequestDto } from './dto/player.info.dto';
import { CreatePlayerRequestDto } from './dto/create.player.request.sto';
import { DepositeRequestDto } from './dto/deposite.request.dto';
import { WithdrawRequestDto } from './dto/withdraw.request.dto';

@Controller('/api/v1')
@ApiTags('SeamLess')
export class NagagamesController {
  constructor(private readonly nagaGamesService: NagagamesService) {}

  @ApiOperation({ summary: 'API to authorize player' })
  @ApiOkResponse({ description: 'success' })
  @HttpCode(200)
  @Post('/vendor/auth')
  async authSeamless(
    @Headers('x-signature') xSignature: string,
    @Body() authRequestSto: AuthRequestDto,
  ) {
    const data = await this.nagaGamesService.authorize(
      authRequestSto,
      xSignature,
    );
    return { code: 200, data };
  }

  @ApiOperation({ summary: 'API to create player' })
  @ApiOkResponse({ description: 'success' })
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/create/player')
  async createPlayer(
    @User() caller: JwtTokenInterface,
    @Body() createPlayerRequestDto: CreatePlayerRequestDto,
  ) {
    const data = await this.nagaGamesService.createPlayer(
      caller,
      createPlayerRequestDto,
    );
    return { code: 200, data };
  }

  @ApiOperation({ summary: 'API to deposit money' })
  @ApiOkResponse({ description: 'success' })
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/transfer/deposite')
  async deposite(
    @User() caller: JwtTokenInterface,
    @Body() depositeRequestDto: DepositeRequestDto,
  ) {
    const data = await this.nagaGamesService.deposite(
      caller,
      depositeRequestDto,
    );
    return { code: 200, data };
  }

  @ApiOperation({ summary: 'API to withdraw money' })
  @ApiOkResponse({ description: 'success' })
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/transfer/withdraw')
  async withdraw(
    @User() caller: JwtTokenInterface,
    @Body() withdrawRequestDto: WithdrawRequestDto,
  ) {
    const data = await this.nagaGamesService.withdraw(
      caller,
      withdrawRequestDto,
    );
    return { code: 200, data };
  }
}
