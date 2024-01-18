import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigsModule } from './configs/configs.module';

@Module({
  imports: [ConfigsModule, UsersModule],
})
export class AppModule {}
