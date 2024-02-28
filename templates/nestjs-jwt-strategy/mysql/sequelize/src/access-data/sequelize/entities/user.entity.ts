import { Column, Model, Table, DataType } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'Users',
})
export class User extends Model<User> {
  @ApiProperty()
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @ApiProperty()
  @Column(DataType.STRING)
  name: string;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @ApiProperty()
  @Column(DataType.STRING)
  password: string;
}
