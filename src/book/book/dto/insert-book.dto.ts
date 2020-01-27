import { IsString, ValidateNested } from "class-validator";
import { CreateAuthorDTO } from "src/book/author/dto/create-author.dto";

export class InsertBookDto {
  @IsString()
  readonly title: string;

  @ValidateNested()
  readonly author: CreateAuthorDTO;

  @IsString({ each: true })
  readonly genre: string[];

  @IsString()
  readonly ageGroup: string;
}
