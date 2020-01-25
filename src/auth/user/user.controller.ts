import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body
} from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() user: CreateUserDTO) {
    return this.userService.userSignup(user);
  }
}
