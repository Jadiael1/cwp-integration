import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum JobFilterType {
  EXCLUDE = 'exclude',
  ONLY = 'only',
}

export enum JobReturnType {
  JSON = 'json',
  XLSX = 'xlsx',
}

export enum JobStatus {
  FAILED = 'failed',
  COMPLETED = 'completed',
}

export class JobDTO {
  @ApiProperty({
    description: 'The name of the job',
    required: false,
  })
  @IsString()
  @IsOptional()
  jobName?: string;

  @ApiProperty({
    description: 'The type of filter to apply',
    example: 'exclude',
    required: false,
    enum: JobFilterType,
  })
  @IsEnum(JobFilterType)
  @IsOptional()
  filterType?: JobFilterType;

  @ApiProperty({
    description: 'The status of the jobs to export',
    example: 'failed',
    required: false,
    enum: JobStatus,
  })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @ApiProperty({
    description: 'The return type to be returned (json or xlsx)',
    example: 'xlsx',
    required: false,
    enum: JobReturnType,
  })
  @IsEnum(JobReturnType)
  @IsOptional()
  returnType?: JobReturnType;
}
