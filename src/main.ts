import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { log } from "./logging";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();
  const port = process.env.PORT || 3000;
  log(`Starting on Port ${port}`);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
