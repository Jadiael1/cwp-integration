import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_ACCOUNT } from '../bullMQ.constants';
import { JuvHostService } from '@services/juvhost.service';

@Processor(QUEUE_ACCOUNT)
export class BullMQProcessorAccount extends WorkerHost {
  constructor(private juvHost: JuvHostService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case 'create-account-cwp':
        return this.juvHost.createAccount(job);
      default:
        throw new Error(`Process ${job.name} not implemented`);
    }
  }
}
