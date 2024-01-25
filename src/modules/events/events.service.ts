import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AlsService } from '../als/als.service';

@Injectable()
export class EventsService {
  constructor(private readonly alsService: AlsService) {}

  @OnEvent('*.commit', { async: true })
  async handleCommitEvent() {
    console.log(':::::::::::::::::::::::::::::::::commit');
    // await this.alsService.entityManager?.queryRunner?.commitTransaction();
  }

  @OnEvent('*.rollback', { async: true })
  async handleRollbackEvent() {
    console.log(':::::::::::::::::::::::::::::::::rollback');
    // await this.alsService.entityManager?.queryRunner?.rollbackTransaction();
  }

  @OnEvent('*.release', { async: true })
  async handleEndEvent() {
    console.log(':::::::::::::::::::::::::::::::::release');
    // await this.alsService.entityManager?.queryRunner?.release();
  }
}
