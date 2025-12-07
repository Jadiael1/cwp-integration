import { Injectable } from '@nestjs/common';
import { InjectQueue as InjectBullMQ } from '@nestjs/bullmq';
import { QUEUE_ACCOUNT } from '../bullMQ/bullMQ.constants';
import { JobsOptions, Queue } from 'bullmq';
import moment from 'moment-timezone';
import { JobDTO, JobFilterType, JobReturnType, JobStatus } from '@dtos/job.dto';
import { myJobDto } from '@dtos/myjob.dto';
import writeXlsxFile, { Schema } from 'write-excel-file/node';
import { AccountDTO } from '@dtos/account.dto';
import { SimpleResponse } from '@interfaces/simple-response.interface';

@Injectable()
export class AccountService {
  constructor(@InjectBullMQ(QUEUE_ACCOUNT) private bullMQQueue: Queue) {}

  async create(account: AccountDTO): Promise<SimpleResponse> {
    await this.bullMQQueue.add(
      'create-account-cwp',
      {
        account,
      },
      {
        timestamp: moment().tz('America/Recife').valueOf(),
      },
    );
    return {
      success: true,
      status: 'OK',
      message: 'Account creation job created successfully',
      data: null,
    };
  }

  async getJobs(query: JobDTO): Promise<myJobDto[]> {
    const completedJobs = await this.bullMQQueue.getCompleted();
    const failedJobs = await this.bullMQQueue.getFailed();
    const waitingJobs = await this.bullMQQueue.getWaiting();
    const activeJobs = await this.bullMQQueue.getActive();
    const delayedJobs = await this.bullMQQueue.getDelayed();
    const allJobs = [
      ...completedJobs,
      ...failedJobs,
      ...waitingJobs,
      ...activeJobs,
      ...delayedJobs,
    ];
    const jobs =
      query.status === JobStatus.COMPLETED
        ? await this.bullMQQueue.getCompleted()
        : query.status === JobStatus.FAILED
          ? await this.bullMQQueue.getFailed()
          : allJobs;
    if (query.jobName) {
      switch (query.filterType) {
        case JobFilterType.EXCLUDE:
          return jobs
            .filter((job) => job.name !== query.jobName)
            .map((job) => ({
              name: job.name,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              data: job.data,
              opts: {
                ...job.opts,
                timestamp: moment(job.opts.timestamp)
                  .tz('America/Recife')
                  .locale('pt-BR')
                  .format('DD/MM/YYYY HH:mm:ss'),
              } as JobsOptions & { timestamp?: number | string | undefined },
              id: job.id,
              progress: job.progress,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              returnvalue: job.returnvalue,
              stacktrace: job.stacktrace,
              attemptsMade: job.attemptsMade,
              delay: job.delay,
              timestamp: moment(job.timestamp)
                .tz('America/Recife')
                .locale('pt-BR')
                .format('DD/MM/YYYY HH:mm:ss'),
              queueQualifiedName: job.queueQualifiedName,
              finishedOn: job.finishedOn
                ? moment(job.finishedOn)
                    .tz('America/Recife')
                    .locale('pt-BR')
                    .format('DD/MM/YYYY HH:mm:ss')
                : null,
              processedOn: job.processedOn
                ? moment(job.processedOn)
                    .tz('America/Recife')
                    .locale('pt-BR')
                    .format('DD/MM/YYYY HH:mm:ss')
                : null,

              failedReason: job.failedReason,
            }));
        case JobFilterType.ONLY:
          return jobs
            .filter((job) => job.name === query.jobName)
            .map((job) => ({
              name: job.name,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              data: job.data,
              opts: {
                ...job.opts,
                timestamp: moment(job.opts.timestamp)
                  .tz('America/Recife')
                  .locale('pt-BR')
                  .format('DD/MM/YYYY HH:mm:ss'),
              } as JobsOptions & { timestamp?: number | string | undefined },
              id: job.id,
              progress: job.progress,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              returnvalue: job.returnvalue,
              stacktrace: job.stacktrace,
              attemptsMade: job.attemptsMade,
              delay: job.delay,
              timestamp: moment(job.timestamp)
                .tz('America/Recife')
                .locale('pt-BR')
                .format('DD/MM/YYYY HH:mm:ss'),
              queueQualifiedName: job.queueQualifiedName,
              finishedOn: job.finishedOn
                ? moment(job.finishedOn)
                    .tz('America/Recife')
                    .locale('pt-BR')
                    .format('DD/MM/YYYY HH:mm:ss')
                : null,
              processedOn: job.processedOn
                ? moment(job.processedOn)
                    .tz('America/Recife')
                    .locale('pt-BR')
                    .format('DD/MM/YYYY HH:mm:ss')
                : null,

              failedReason: job.failedReason,
            }));
      }
    }
    const convertedJobs = jobs.map((job) => ({
      name: job.name,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: job.data,
      opts: {
        ...job.opts,
        timestamp: moment(job.opts.timestamp)
          .tz('America/Recife')
          .locale('pt-BR')
          .format('DD/MM/YYYY HH:mm:ss'),
      } as JobsOptions & { timestamp?: number | string | undefined },
      id: job.id,
      progress: job.progress,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      returnvalue: job.returnvalue,
      stacktrace: job.stacktrace,
      attemptsMade: job.attemptsMade,
      delay: job.delay,
      timestamp: moment(job.timestamp)
        .tz('America/Recife')
        .locale('pt-BR')
        .format('DD/MM/YYYY HH:mm:ss'),
      queueQualifiedName: job.queueQualifiedName,
      finishedOn: job.finishedOn
        ? moment(job.finishedOn)
            .tz('America/Recife')
            .locale('pt-BR')
            .format('DD/MM/YYYY HH:mm:ss')
        : null,
      processedOn: job.processedOn
        ? moment(job.processedOn)
            .tz('America/Recife')
            .locale('pt-BR')
            .format('DD/MM/YYYY HH:mm:ss')
        : null,

      failedReason: job.failedReason,
    }));
    return convertedJobs;
  }

  async treatJobs(jobs: myJobDto[], query: JobDTO) {
    if (query.returnType !== JobReturnType.XLSX) {
      return jobs;
    }
    type TExportJobRow = {
      name: string;
      data: string;
      opts: string;
      id: string | undefined;
      progress: string;
      returnvalue: string;
      stacktrace: string;
      attemptsMade: number;
      delay: number;
      timestamp: number | string;
      queueQualifiedName: string;
      finishedOn?: number | string | null;
      processedOn?: number | string | null;
      failedReason: string | null | undefined;
    };
    const dataRows: TExportJobRow[] = jobs.map((job) => ({
      name: job.name,
      data: JSON.stringify(job.data),
      opts: JSON.stringify(job.opts),
      id: job.id,
      progress: JSON.stringify(job.progress),
      returnvalue: JSON.stringify(job.returnvalue),
      stacktrace: JSON.stringify(job.stacktrace),
      attemptsMade: job.attemptsMade,
      delay: job.delay,
      timestamp: job.timestamp,
      queueQualifiedName: job.queueQualifiedName,
      finishedOn: job.finishedOn,
      processedOn: job.processedOn,
      failedReason: job.failedReason,
    }));

    const schema: Schema<TExportJobRow> = [
      { column: 'name', value: (row) => row.name, width: 20 },
      { column: 'data', value: (row) => row.data, width: 30 },
      { column: 'opts', value: (row) => row.opts, width: 30 },
      { column: 'id', value: (row) => row.id ?? '', width: 15 },
      { column: 'progress', value: (row) => row.progress, width: 10 },
      { column: 'returnvalue', value: (row) => row.returnvalue, width: 30 },
      { column: 'stacktrace', value: (row) => row.stacktrace, width: 40 },
      { column: 'attemptsMade', value: (row) => row.attemptsMade, width: 15 },
      { column: 'delay', value: (row) => row.delay, width: 10 },
      { column: 'timestamp', value: (row) => row.timestamp, width: 20 },
      {
        column: 'queueQualifiedName',
        value: (row) => row.queueQualifiedName,
        width: 30,
      },
      { column: 'finishedOn', value: (row) => row.finishedOn ?? '', width: 20 },
      {
        column: 'processedOn',
        value: (row) => row.processedOn ?? '',
        width: 20,
      },
      {
        column: 'failedReason',
        value: (row) => row.failedReason ?? '',
        width: 40,
      },
    ];

    const buffer = await writeXlsxFile<TExportJobRow>(dataRows, {
      schema,
      buffer: true,
      sheet: 'Jobs',
    });

    return buffer;
  }
}
