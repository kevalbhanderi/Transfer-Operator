import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {} from 'couchbase';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorator/user.decorator';
import { JwtTokenInterface } from '../../interface/jwt.token.interface';
import { GamesService } from './games.service';
import { TransformInterceptor } from '../../dispatchers/trsnsform.interceptor';
import { SuccessResponse } from '../../interface/success.response.interface';

@Controller('/api/v1/games')
@ApiTags('Game')
@UseInterceptors(TransformInterceptor)
export class GamesController {
  constructor(private readonly gameService: GamesService) {}

  @ApiOperation({ summary: 'API to list all games for web' })
  @ApiOkResponse({ description: 'success' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async webGames(@User() caller: JwtTokenInterface) {
    const data = await this.gameService.listGames(caller);
    return { data };
  }

  @ApiOperation({ summary: 'API to open Game' })
  @ApiOkResponse({ description: 'success' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/open')
  async openGame(@User() caller: JwtTokenInterface) {
    const data = await this.gameService.openGame(caller);
    return { data };
  }

  @ApiOperation({ summary: 'API to get Player Balance from NagaGames' })
  @ApiOkResponse({ description: 'success' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/client/player/balance')
  async nagaGamesPlayerBalance(
    @User() caller: JwtTokenInterface,
  ): Promise<SuccessResponse<{}>> {
    const data = await this.gameService.NagaGamebalance(caller);
    return { data };
  }
}
