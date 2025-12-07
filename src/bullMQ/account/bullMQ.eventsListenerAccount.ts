import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { QUEUE_ACCOUNT } from '../bullMQ.constants';
import { InjectQueue as InjectBullMQQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@QueueEventsListener(QUEUE_ACCOUNT)
export class BullMQEventsListenerAccount extends QueueEventsHost {
  constructor(@InjectBullMQQueue(QUEUE_ACCOUNT) private bullMQQueue: Queue) {
    super();
  }

  @OnQueueEvent('failed')
  async onFailed(args: { jobId: string; failedReason: string; prev?: string }) {
    const job = await this.bullMQQueue.getJob(args.jobId);
    if (job) {
      console.log(`Job '${args.jobId}' falhou.`);
    }
  }
}
