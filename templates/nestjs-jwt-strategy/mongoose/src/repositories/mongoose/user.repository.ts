import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../../modules/users/dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from '../../access-data/mongoose/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return await user.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  findById(id: string): Promise<User> {
    return this.userModel.findOne({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findOneAndUpdate({ id }, updateUserDto);
  }

  async remove(id: string): Promise<User> {
    return await this.userModel.findOneAndDelete({ id });
  }
}
