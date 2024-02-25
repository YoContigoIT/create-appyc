import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/access-data/sequelize/entities/user.entity';
import { UserRepository } from 'src/repositories/typeorm/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { DBErrors } from 'src/utils/database-errors';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  private logger = new Logger('UserService');
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashed = await hash(createUserDto.password, 10);
      return await this.userRepository.create({
        ...createUserDto,
        password: hashed,
      });
    } catch (error) {
      this.logger.error(error);
      DBErrors(error);
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.remove(id);
  }

  async login(
    payload: LoginUserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findByEmail(payload.email);

    if (!user) throw new NotFoundException('User not found');

    if (!(await compare(payload.password, user.password)))
      throw new BadRequestException('invalid crendecials');

    const access_token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '24h',
      },
    );

    const refresh_token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30d',
      },
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
