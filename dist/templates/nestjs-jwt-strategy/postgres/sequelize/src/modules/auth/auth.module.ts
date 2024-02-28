import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '../../repositories/typeorm/user.repository';
import { userProvider } from '../../access-data/sequelize/sequelize.providers';
import { DatabaseModule } from '../../access-data/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [JwtStrategy, userProvider, UserRepository],
  exports: [PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
