import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetKeyValueDto {
  @ApiProperty({
    description: 'The key to get in Redis',
    example: 'myKey',
  })
  @IsString()
  @IsNotEmpty()
  key: string;
}
