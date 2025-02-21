import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_USERNAME: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().default(''),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        USER_BOARD: Joi.string().default('admin'),
        PASS_BOARD: Joi.string().default('password'),
      }),
      validationOptions: {
        abortEarly: false, // Retorna todos os erros de uma só vez
      },
    }),
  ],
})
export class EnvironmentConfigModule {}
