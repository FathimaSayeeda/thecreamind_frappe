import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Res,
  HttpStatus,
  UseGuards
} from "@nestjs/common";
import { InsertBookDto } from "./dto/insert-book.dto";
import { BookService } from "./book.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("book")
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks(
    @Query("limitStart") limitStart: number,
    @Query("limitPageLength") limitPageLength: number
  ) {
    return limitStart + " " + limitPageLength;
  }

  @Get("/:bookId")
  async getBook(@Param("bookId") bookId: string) {
    const b = await this.bookService.getBook(bookId);
    if (!b) {
      return {
        _err: true,
        _msg: "NOT_FOUND"
      };
    } else {
      return b;
    }
  }

  @Put("/:bookId")
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateBook(
    @Param("bookId") bookId: string,
    @Body() bookData: InsertBookDto
  ) {
    return await this.bookService.updateBook(bookId, bookData);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async insertBook(@Body() bookData: InsertBookDto) {
    return await this.bookService.insertBook(bookData);
  }
}
