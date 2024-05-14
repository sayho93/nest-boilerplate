import { Global, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Global()
@Module({
  providers: [TransactionService],
})
export class TransactionModule {}
