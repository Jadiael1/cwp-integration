import { Module } from '@nestjs/common';
import axios from 'axios';
import { Agent } from 'https';

import { Http } from './http';

const juvHostInstance = axios.create({
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
