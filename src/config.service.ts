import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as expressBasicAuth from 'express-basic-auth';

const ormOptionMysql = TypeOrmModule.forRoot({
  name: process.env.NODE_ENV == 'production' ? process.env.DB_CONNECTION_NAME_PROD : process.env.DB_CONNECTION_NAME_DEV,
  type: 'mariadb',
  host: process.env.NODE_ENV == 'production' ? process.env.DB_HOST_PROD : process.env.DB_HOST_DEV,
  port: process.env.NODE_ENV == 'production' ? parseInt(process.env.DB_PORT_PROD) : parseInt(process.env.DB_PORT_DEV),
  username: process.env.NODE_ENV == 'production' ? process.env.DB_USERNAME_PROD : process.env.DB_USERNAME_DEV,
  password: process.env.NODE_ENV == 'production' ? process.env.DB_PASSWORD_PROD : process.env.DB_PASSWORD_DEV,
  database: process.env.NODE_ENV == 'production' ? process.env.DB_NAME_PROD : process.env.DB_NAME_DEV,
  synchronize: false,
} as TypeOrmModuleOptions);

const queueConfig = BullModule.forRoot({
  connection: {
    host: process.env.NODE_ENV == 'production' ? process.env.REDIS_HOST_PROD : process.env.REDIS_HOST_DEV,
    port:
      process.env.NODE_ENV == 'production'
        ? parseInt(process.env.REDIS_PORT_PROD)
        : parseInt(process.env.REDIS_PORT_DEV),
    username: process.env.NODE_ENV == 'production' ? process.env.REDIS_USERNAME_PROD : process.env.REDIS_USERNAME_DEV,
    password: process.env.NODE_ENV == 'production' ? process.env.REDIS_PASSWORD_PROD : process.env.REDIS_PASSWORD_DEV,
  },
  defaultJobOptions: {
    removeOnComplete: 900000,
    removeOnFail: 900000,
    // attempts: 3,
    // backoff: {
    //   type: 'exponential',
    //   delay: 10000,
    // },
    delay: 6000,
  },
});

const userBoard = process.env.NODE_ENV == 'production' ? process.env.USER_BOARD_PROD : process.env.USER_BOARD_DEV;
const passBoard = process.env.NODE_ENV == 'production' ? process.env.PASS_BOARD_PROD : process.env.PASS_BOARD_DEV;
const bullBoardConfig = BullBoardModule.forRoot({
  route: '/queues',
  adapter: ExpressAdapter,
  middleware: [
    expressBasicAuth({
      users: { [userBoard]: passBoard },
      challenge: true,
    }),
  ],
});

export { queueConfig, bullBoardConfig };
