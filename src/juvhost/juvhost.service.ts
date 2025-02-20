import { Injectable } from '@nestjs/common';
import { JuvHostHttpService } from '@services/juvhost-http.service';
import { SimpleResponse } from '@interfaces/simple-response.interface';
import { Job, tryCatch } from 'bullmq';
import { ResponseManagerService } from '@services/response-manager.service';

@Injectable()
export class JuvHostService {
  constructor(
    private juvHostHttp: JuvHostHttpService,
    private resManager: ResponseManagerService,
  ) {}

  async createAccount(job: Job<any>): Promise<SimpleResponse[]> {
    const { account } = job.data;
    const promises: Promise<SimpleResponse>[] = [];
    promises.push(this.juvHostHttp.createAccount(account));
    const resolution = await Promise.allSettled(promises);
    return this.resManager.processPromisesResult(resolution);
  }
}
