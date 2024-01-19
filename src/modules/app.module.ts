import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigsModule } from './configs/configs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigsModule, CommonModule, UsersModule],
  providers: [],
})
export class AppModule {}
