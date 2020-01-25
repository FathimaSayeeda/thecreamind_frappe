import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "./book.entity";
import { Repository, InsertResult, UpdateResult } from "typeorm";
import { InsertBookDto } from "./dto/insert-book.dto";
import { Genre } from "../genre/genre.entity";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>
  ) {}

  getAll(): Promise<Book[]> {
    return this.bookRepo.find();
  }

  async getBook(id: string): Promise<Book> {
    return (
      await this.bookRepo.find({
        where: {
          id
        }
      })
    )[0];
  }

  insertBook(book: InsertBookDto): Promise<Book> {
    const b: Book = this.getBookFromDTO(book);
    return this.bookRepo.save(b);
  }

  updateBook(bookId: string, book: InsertBookDto): Promise<Book> {
    const b: Book = this.getBookFromDTO(book);
    b.id = bookId;
    return this.bookRepo.save(b);
  }

  getBookFromDTO(bookData: InsertBookDto): Book {
    const b: Book = new Book();
    b.title = bookData.title;
    b.author = bookData.author;
    b.ageGroup = bookData.ageGroup;
    b.genre = [];
    for (const g of bookData.genre) {
      const genre = new Genre();
      genre.type = g;
      b.genre.push(genre);
    }
    return b;
  }
}
