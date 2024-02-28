import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeProvider } from './sequelize/sequelize.providers';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [SequelizeProvider],
  exports: [SequelizeProvider],
})
export class DatabaseModule {}
