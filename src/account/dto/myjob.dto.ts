import { JobProgress, JobsOptions } from 'bullmq';

// interface ExtendedJobsOptions extends JobsOptions {
//   customTimestamp: string;
// }

// // 2. Corrigindo o erro de sintaxe: Use 'extends Job'
// export interface ExportableJob extends Job {
//   opts: ExtendedJobsOptions;
// }

export type myJobDto = {
  name: string;
  data: any;
  opts: JobsOptions & { timestamp?: number | string | undefined };
  id?: string;
  progress: JobProgress;
  returnvalue: any;
  stacktrace: string[];
  attemptsMade: number;
  delay: number;
  timestamp: number | string;
  queueQualifiedName: string;
  finishedOn?: number | string | null;
  processedOn?: number | string | null;
  failedReason: string;
};
