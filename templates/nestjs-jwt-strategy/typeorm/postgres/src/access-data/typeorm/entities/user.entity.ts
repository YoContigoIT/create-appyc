import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'Users',
})
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text')
  name: string;

  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column('text')
  password: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: string;
}
