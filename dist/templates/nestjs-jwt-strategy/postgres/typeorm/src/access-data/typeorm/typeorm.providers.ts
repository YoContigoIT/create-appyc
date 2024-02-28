import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

export const TypeORMProvider = {
  provide: 'TYPEORM_DATA_SOURCE',
  useFactory: async (configService: ConfigService) => {
    const dataSource = new DataSource({
      type: configService.get<string>('DB_TYPE') as any,
      host: configService.get<string>('DB_HOST'),
      port: +configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    });

    return dataSource.initialize();
  },
  inject: [ConfigService],
};

export const userProvider = {
  provide: 'USER_REPOSITORY',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  inject: ['TYPEORM_DATA_SOURCE'],
};
