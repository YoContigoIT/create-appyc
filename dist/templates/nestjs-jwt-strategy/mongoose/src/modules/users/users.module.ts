import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { userProvider } from '../../access-data/mongoose/mongoose.providers';
import { UserRepository } from '../../repositories/mongoose/user.repository';
import { DatabaseModule } from '../../access-data/database.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, userProvider],
})
export class UsersModule {}
