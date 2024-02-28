import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    minLength: 4,
    type: String,
  })
  @IsString()
  @MinLength(4)
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: 4,
    type: String,
  })
  @IsString()
  @MinLength(4)
  password: string;
}
