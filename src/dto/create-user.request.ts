import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
