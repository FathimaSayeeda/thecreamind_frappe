import { IsString } from "class-validator";

export class CreateUserDTO {
  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  password: string;
}
