import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Sequelize } from 'sequelize-typescript';

export const SequelizeProvider = {
  provide: 'SEQUELIZE_PROVIDER',
  useFactory: async (configService: ConfigService) => {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: configService.get('DB_HOST'),
      port: +configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
    });
    sequelize.addModels([User]);
    await sequelize.sync();
    return sequelize;
  },
  inject: [ConfigService],
};

export const userProvider = {
  provide: 'USER_REPOSITORY',
  useValue: User,
};
