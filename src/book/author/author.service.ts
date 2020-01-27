import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Author } from "./author.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>
  ) {}

  getAllAuthors() {
    return this.authorRepo.find();
  }
}
