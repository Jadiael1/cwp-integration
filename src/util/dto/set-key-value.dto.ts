import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SetKeyValueDto {
  @ApiProperty({
    description: 'The key to set in Redis',
    example: 'myKey',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: 'The value to associate with the key',
    example: 'someValue',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}
