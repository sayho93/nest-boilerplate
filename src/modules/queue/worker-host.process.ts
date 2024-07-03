import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { LoggerService } from '../logger/logger.service';

export abstract class WorkerHostProcessor extends WorkerHost {
  protected readonly loggerService: LoggerService;

  @OnWorkerEvent('completed')
  private onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.loggerService.debug(
      this.onCompleted.name,
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${JSON.stringify(returnvalue)}`,
    );
  }

  @OnWorkerEvent('progress')
  private onProgress(job: Job) {
    const { id, name, progress } = job;
    this.loggerService.debug(this.onProgress.name, `Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  private onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.loggerService.error(
      this.onFailed.name,
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  private onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.loggerService.debug(
      this.onActive.name,
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
