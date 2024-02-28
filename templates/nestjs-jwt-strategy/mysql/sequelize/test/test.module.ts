import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/access-data/sequelize/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory',
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
      dropSchema: true,
    }),
  ],
})
export class TestModule {}
