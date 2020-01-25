import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Res,
  Get,
  UseGuards
} from "@nestjs/common";
import { LoginDTO } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "../auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @UsePipes(new ValidationPipe())
  async login(@Body() creds: LoginDTO, @Res() res) {
    const r = await this.authService.login(creds);
    if (typeof r !== "string" && r.email && r.id) {
      res.cookie("sid", r.id, {
        secure: true, // 2 days expiry
        expires: new Date(Date.now() + (2 * 24 * 60 * 60 * 1000))
      });
    }
    res.send(r);
    return;
  }

  @Get("is-logged-in")
  @UseGuards(AuthGuard)
  isLoggedIn() {
    // if it gets past the guards, we are logged in
    return {
      isLoggedIn: true,
      ...this.authService.currentUser
    };
  }
}
