import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";

import { BookModule } from "./book/book.module";
import { Book } from "./book/book/book.entity";
import { Genre } from "./book/genre/genre.entity";

import { AuthModule } from "./auth/auth.module";
import { User } from "./auth/user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "test.sqlite",
      entities: [Book, Genre, User],
      synchronize: true
    }),
    BookModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
