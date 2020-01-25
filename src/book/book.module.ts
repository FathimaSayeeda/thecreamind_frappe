import { Module } from "@nestjs/common";
import { BookController } from "./book/book.controller";
import { GenreController } from "./genre/genre.controller";
import { BookService } from "./book/book.service";
import { GenreService } from "./genre/genre.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./book/book.entity";
import { Genre } from "./genre/genre.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Book, Genre])],
  exports: [TypeOrmModule],
  controllers: [BookController, GenreController],
  providers: [BookService, GenreService]
})
export class BookModule {}
