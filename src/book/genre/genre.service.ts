import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Genre } from "./genre.entity";
import { Repository } from "typeorm";

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>
  ) {}

  getAll() {
    return this.genreRepo.find();
  }
}
