import { Module } from "@nestjs/common";
import { BookController } from "./book/book.controller";
import { GenreController } from "./genre/genre.controller";
import { BookService } from "./book/book.service";
import { GenreService } from "./genre/genre.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./book/book.entity";
import { Genre } from "./genre/genre.entity";
import { AuthModule } from "src/auth/auth.module";
import { AuthorController } from "./author/author.controller";
import { AuthorService } from "./author/author.service";
import { Author } from "./author/author.entity";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Book, Genre, Author])],
  exports: [TypeOrmModule],
  controllers: [BookController, GenreController, AuthorController],
  providers: [BookService, GenreService, AuthorService]
})
export class BookModule {}
