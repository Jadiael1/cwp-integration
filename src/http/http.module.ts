import { Module } from '@nestjs/common';
import axios from 'axios';
import { Agent } from 'https';

import { Http } from './http';

const juvHostInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.CWP_API_PROD : process.env.CWP_API_DEV,
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent: new Agent({
    rejectUnauthorized: false,
  }),
});

@Module({
  providers: [
    {
      provide: 'juvHostHttp',
      useFactory: () => new Http(juvHostInstance),
    },
  ],
  exports: ['juvHostHttp'],
})
export class HttpModule {}
