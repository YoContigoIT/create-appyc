import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mongooseProvider } from './mongoose/mongoose.providers';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [mongooseProvider],
  exports: [mongooseProvider],
})
export class DatabaseModule {}
