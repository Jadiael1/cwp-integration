import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as expressBasicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

const ormOptionMysql = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) =>
    ({
      name: configService.get<string>('DB_CONNECTION_NAME'),
      type: 'mariadb',
      host: configService.get<string>('DB_HOST'),
      port: parseInt(configService.get<string>('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      synchronize: false,
    }) as TypeOrmModuleOptions,
  inject: [ConfigService],
});

const queueConfig = BullModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    connection: {
      host: configService.get<string>('REDIS_HOST'),
      port: parseInt(configService.get<string>('REDIS_PORT'), 10),
      username: configService.get<string>('REDIS_USERNAME'),
      password: configService.get<string>('REDIS_PASSWORD'),
    },
    defaultJobOptions: {
      removeOnComplete: 900000,
      removeOnFail: 900000,
      // attempts: 3,
      // backoff: {
      //   type: 'exponential',
      //   delay: 10000,
      // },
      delay: 10000,
    },
  }),
  inject: [ConfigService],
});

const bullBoardConfig = BullBoardModule.forRoot({
  route: '/queues',
  adapter: ExpressAdapter,
  middleware: [
    expressBasicAuth({
      users: { [process.env.USER_BOARD]: process.env.PASS_BOARD },
      challenge: true,
    }),
  ],
});

export { queueConfig, bullBoardConfig };
