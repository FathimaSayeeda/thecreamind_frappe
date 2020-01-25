import { IsString, IsArray } from "class-validator";

export class InsertBookDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly author: string;

  @IsString({ each: true })
  readonly genre: string[];

  @IsString()
  readonly ageGroup: string;
}
