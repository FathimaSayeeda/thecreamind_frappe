import { IsString } from "class-validator";

export class CreateAuthorDTO {
  id?: string;

  @IsString()
  firstName: string;

  lastName?: string;
}
