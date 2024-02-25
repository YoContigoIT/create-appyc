import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeORMProvider } from './typeorm/typeorm.providers';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [TypeORMProvider],
  exports: [TypeORMProvider],
})
export class DatabaseModule {}
