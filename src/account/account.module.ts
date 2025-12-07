import { Module } from '@nestjs/common';
import { AccountController } from '@controllers/account.controller';
import { AccountService } from '@services/account.service';
import { JuvHostModule } from '@modules/juvhost.module';
import { BullModule as BullMQModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { QUEUE_ACCOUNT } from '../bullMQ/bullMQ.constants';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullMQProcessorAccount } from '../bullMQ/account/bullMQ.processorAccount';
import { BullMQEventsListenerAccount } from '../bullMQ/account/bullMQ.eventsListenerAccount';

@Module({
  controllers: [AccountController],
  imports: [
    BullMQModule.registerQueue({
      name: QUEUE_ACCOUNT,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_ACCOUNT,
      adapter: BullMQAdapter,
    }),
    JuvHostModule,
  ],
  providers: [
    AccountService,
    BullMQProcessorAccount,
    BullMQEventsListenerAccount,
  ],
})
export class AccountModule {}
