import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  Get,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AccountService } from '@services/account.service';
import type { Response } from 'express';
import { JobDTO, JobFilterType, JobStatus, JobReturnType } from '@dtos/job.dto';
import { AccountDTO } from '@dtos/account.dto';
import { TokenGuard } from '@common/guards/token.guard';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Handle account actions' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account creation job created successfully',
  })
  @UseGuards(TokenGuard)
  async handleAccount(@Body() account: AccountDTO): Promise<any> {
    return await this.accountService.create(account);
  }

  @Get('export-jobs')
  @ApiOperation({ summary: 'Export jobs with optional filtering' })
  @ApiQuery({
    name: 'jobName',
    type: String,
    required: false,
    description: 'Name of the job to filter',
    example: 'create-account-cwp',
  })
  @ApiQuery({
    name: 'filterType',
    enum: JobFilterType,
    required: false,
    description: 'Type of filter to apply (exclude or only)',
  })
  @ApiQuery({
    name: 'status',
    enum: JobStatus,
    required: false,
    description: 'Status of the jobs to export (failed or completed)',
  })
  @ApiQuery({
    name: 'returnType',
    enum: JobReturnType,
    required: false,
    description: 'The return type to be returned (json or xlsx)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Jobs exported successfully',
  })
  async exportJobs(@Query() query: JobDTO, @Res() res: Response): Promise<any> {
    const jobs = await this.accountService.getJobs(query);
    if (query.returnType !== JobReturnType.XLSX) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(jobs);
      return;
    }
    const buffer = await this.accountService.treatJobs(jobs, query);
    const fileName = `jobs-user-${new Date().getTime()}`;

    res.set({
      'Content-Disposition': `attachment; filename=${fileName}.xlsx`,
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    res.send(buffer);
  }
}
