import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UserSchema } from './schemas/user.schema';

export const mongooseProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: (configService: ConfigService): Promise<typeof mongoose> =>
    mongoose.connect(configService.get('MONGO_URI')),
  inject: [ConfigService],
};

export const userProvider = {
  provide: 'USER_MODEL',
  useFactory: (connection: mongoose.Connection) =>
    connection.model('User', UserSchema),
  inject: ['DATABASE_CONNECTION'],
};
