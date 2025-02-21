import { Injectable } from '@nestjs/common';
import { InjectQueue as InjectBullMQ } from '@nestjs/bullmq';
import { QUEUE_ACCOUNT } from '../bullMQ/bullMQ.constants';
import { Queue } from 'bullmq';
import * as moment from 'moment-timezone';
import { JobDTO, JobFilterType, JobReturnType, JobStatus } from '@dtos/job.dto';
import * as XLSX from 'xlsx';
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

  async getJobs(query: JobDTO) {
    const completedJobs = await this.bullMQQueue.getCompleted();
    const failedJobs = await this.bullMQQueue.getFailed();
    const waitingJobs = await this.bullMQQueue.getWaiting();
    const activeJobs = await this.bullMQQueue.getActive();
    const delayedJobs = await this.bullMQQueue.getDelayed();
    const allJobs = [...completedJobs, ...failedJobs, ...waitingJobs, ...activeJobs, ...delayedJobs];
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
            .filter(job => job.name !== query.jobName)
            .map(job => ({
              name: job.name,
              data: job.data,
              opts: {
                ...job.opts,
                timestamp: moment(job.opts.timestamp)
                  .tz('America/Recife')
                  .locale('pt-BR')
                  .format('DD/MM/YYYY HH:mm:ss'),
              },
              id: job.id,
              progress: job.progress,
              returnvalue: job.returnvalue,
              stacktrace: job.stacktrace,
              attemptsMade: job.attemptsMade,
              delay: job.delay,
              timestamp: moment(job.timestamp).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
              queueQualifiedName: job.queueQualifiedName,
              finishedOn: job.finishedOn
                ? moment(job.finishedOn).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                : null,
              processedOn: job.processedOn
                ? moment(job.processedOn).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                : null,

              failedReason: job.failedReason,
            }));
        case JobFilterType.ONLY:
          return jobs
            .filter(job => job.name === query.jobName)
            .map(job => ({
              name: job.name,
              data: job.data,
              opts: {
                ...job.opts,
                timestamp: moment(job.opts.timestamp)
                  .tz('America/Recife')
                  .locale('pt-BR')
                  .format('DD/MM/YYYY HH:mm:ss'),
              },
              id: job.id,
              progress: job.progress,
              returnvalue: job.returnvalue,
              stacktrace: job.stacktrace,
              attemptsMade: job.attemptsMade,
              delay: job.delay,
              timestamp: moment(job.timestamp).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
              queueQualifiedName: job.queueQualifiedName,
              finishedOn: job.finishedOn
                ? moment(job.finishedOn).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                : null,
              processedOn: job.processedOn
                ? moment(job.processedOn).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
                : null,

              failedReason: job.failedReason,
            }));
      }
    }
    const convertedJobs = jobs.map(job => ({
      name: job.name,
      data: job.data,
      opts: {
        ...job.opts,
        timestamp: moment(job.opts.timestamp).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
      },
      id: job.id,
      progress: job.progress,
      returnvalue: job.returnvalue,
      stacktrace: job.stacktrace,
      attemptsMade: job.attemptsMade,
      delay: job.delay,
      timestamp: moment(job.timestamp).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss'),
      queueQualifiedName: job.queueQualifiedName,
      finishedOn: job.finishedOn
        ? moment(job.finishedOn).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
        : null,
      processedOn: job.processedOn
        ? moment(job.processedOn).tz('America/Recife').locale('pt-BR').format('DD/MM/YYYY HH:mm:ss')
        : null,

      failedReason: job.failedReason,
    }));
    return convertedJobs;
  }

  async treatJobs(jobs, query) {
    if (query.returnType !== JobReturnType.XLSX) {
      return jobs;
    }
    const data = jobs.map(job => ({
      name: job.name,
      data: JSON.stringify(job.data),
      opts: JSON.stringify(job.opts),
      id: job.id,
      progress: job.progress,
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
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Jobs');
    const columnWidths = data.reduce((widths, row) => {
      Object.keys(row).forEach((key, i) => {
        const value = row[key];
        const length = value ? value.toString().length : 10;
        widths[i] = Math.max(widths[i] || 10, length);
      });
      return widths;
    }, []);
    ws['!cols'] = columnWidths.map(width => ({ wch: width }));
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
  }
}
