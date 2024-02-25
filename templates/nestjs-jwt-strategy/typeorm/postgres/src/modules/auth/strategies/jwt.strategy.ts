import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../access-data/typeorm/entities/user.entity';
import { UserRepository } from '../../../repositories/typeorm/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET'),
    });
  }

  async validate(payload: any): Promise<User> {
    const { id } = payload;
    const user = await this.userRepository.findById(id);
    if (!user) throw new UnauthorizedException(`Token no valid`);

    return user;
  }
}
