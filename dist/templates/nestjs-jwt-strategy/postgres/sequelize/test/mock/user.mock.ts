import { User } from '../../src/access-data/sequelize/entities/user.entity';
import { CreateUserDto } from '../../src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/modules/users/dto/update-user.dto';
import { LoginUserDto } from '../../src/modules/users/dto/login-user.dto';

export const createUserDto: CreateUserDto = {
  name: 'John',
  email: 'john@email.com',
  password: 'Test123',
};

export const updateUserDto: UpdateUserDto = {
  name: 'Richard',
  email: 'john@email.com',
  password: 'Test123',
};

export const user: User = {
  id: 'user123',
  name: 'John',
  email: 'john@email.com',
  password: 'Test123',
  createdAt: '2023-09-13T08:36:28.000Z',
};

export const loginUserDto: LoginUserDto = {
  email: 'test@example.com',
  password: 'password',
};
