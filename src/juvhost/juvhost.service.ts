import { Injectable } from '@nestjs/common';
import { JuvHostHttpService } from '@services/juvhost-http.service';
import { SimpleResponse } from '@interfaces/simple-response.interface';
import { Job } from 'bullmq';
import { ResponseManagerService } from '@services/response-manager.service';
import { AccountDTO } from '@dtos/account.dto';

interface CreateAccountJobData {
  account: AccountDTO;
}

@Injectable()
export class JuvHostService {
  constructor(
    private readonly juvHostHttp: JuvHostHttpService,
    private readonly resManager: ResponseManagerService,
  ) {}

  async createAccount(
    job: Job<CreateAccountJobData>,
  ): Promise<SimpleResponse[]> {
    const { account } = job.data;

    const promises: Promise<SimpleResponse>[] = [
      this.juvHostHttp.createAccount(account),
    ];

    const resolution = await Promise.allSettled(promises);

    return this.resManager.processPromisesResult(resolution);
  }
}
