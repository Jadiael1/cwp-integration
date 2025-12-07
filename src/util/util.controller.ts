import {
  Controller,
  Get,
  Body,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SetKeyValueDto } from '@dtos/set-key-value.dto';
import { GetKeyValueDto } from '@dtos/get-key-value.dto';
import { UtilService } from '@services/util.service';

@ApiTags('Util')
@Controller('util')
export class UtilController {
  constructor(private utilService: UtilService) {}

  @Get('environment')
  getEnvironment() {
    return this.utilService.getEnvironment();
  }

  @Get('health')
  getHealth() {
    return this.utilService.getHealth();
  }

  @Post('set-redis')
  @HttpCode(200)
  @ApiOperation({ summary: 'Adiciona uma entrada no Redis' })
  @ApiResponse({
    status: 200,
    description: 'The value has been successfully set.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async setKeyValue(@Body() keyValueDto: SetKeyValueDto) {
    return await this.utilService.setKeyValue(
      keyValueDto.key,
      keyValueDto.value,
    );
  }

  @Get('get-redis/:key')
  @ApiOperation({ summary: 'Obtenha um valor pela chave no Redis' })
  @ApiResponse({ status: 200, description: 'Value retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Key not found.' })
  async getKeyValue(@Param() keyValueDto: GetKeyValueDto) {
    const value = await this.utilService.getKeyValue(keyValueDto.key);
    if (value === null) {
      throw new NotFoundException('Key not found');
    }
    return { key: keyValueDto.key, value };
  }

  @Get('node-version')
  @ApiOperation({ summary: 'Obtenha a versão do node' })
  @ApiResponse({ status: 200 })
  getNodeVersion() {
    return this.utilService.getNodeVersion();
  }
}
