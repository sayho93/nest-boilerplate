import { Module } from '@nestjs/common';
import { ConfigsModule } from './configs/configs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigsModule, UsersModule],
})
export class AppModule {}
