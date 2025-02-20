import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AccountAction } from '@enums/account-action.enum';

export class AccountDTO {
  @ApiProperty({
    description: 'Api key',
    required: true,
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Action to be performed in the api',
    example: 'add',
    required: true,
    enum: AccountAction,
  })
  @IsEnum(AccountAction)
  action: AccountAction;

  @ApiProperty({
    description: 'A username',
    example: 'johndoe',
    required: true,
  })
  user: string;

  @ApiProperty({
    description: 'A password',
    example: '8N3O0Je8y04w',
    required: true,
  })
  pass: string;

  @ApiProperty({
    description: 'A domain',
    example: 'mydomain.com',
    required: true,
  })
  domain: string;

  @ApiProperty({
    description: 'A email',
    example: 'admin@mydomain.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'If encodepass is set to true then the password has to be sent base64 encoded',
    example: 'admin@mydomain.com',
    required: false,
  })
  encodepass?: boolean;

  @ApiProperty({
    description: 'A package valid',
    example: 'Starter',
    required: true,
  })
  package: string;

  @ApiProperty({
    description: 'A lang',
    example: 'pt',
    required: true,
  })
  lang: string;

  @ApiProperty({
    description: 'The value for inode is always 0 (unlimited).',
    example: 0,
    required: true,
  })
  inode: number;

  @ApiProperty({
    description:
      'Maximum number of processes a user can create on the system. For standard sites, values ​​between 50 and 100 are usually sufficient.',
    example: 50,
    required: true,
  })
  limit_nproc: number;

  @ApiProperty({
    description:
      'Sets the maximum number of file descriptors that a user can open simultaneously. This limit includes files, network sockets, database connections, and other resources that the operating system considers to be open files.',
    example: 2048,
    required: true,
  })
  limit_nofile: number;

  @ApiProperty({
    description: 'The IP of the CWP panel',
    example: '151.61.212.82',
    required: true,
  })
  server_ips: string;
}
