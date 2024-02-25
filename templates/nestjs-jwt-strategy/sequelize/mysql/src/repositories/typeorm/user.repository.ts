import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../access-data/sequelize/entities/user.entity';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/users/dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create({
      ...createUserDto,
    });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findById(id: string): Promise<User> {
    return this.userRepository.findByPk(id);
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(
      { ...updateUserDto },
      { where: { id } },
    );
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.destroy({
      where: {
        id,
      },
    });
  }
}
