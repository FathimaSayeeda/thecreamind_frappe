import { Injectable } from "@nestjs/common";
import { LoginDTO } from "./dto/login.dto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";
import { compare } from "bcrypt";
import { log } from "../../logging";

@Injectable()
export class AuthService {
  currentUser: User;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async login(
    creds: LoginDTO
  ): Promise<
    "user-not-found" | "invalid-password" | { email: string; id: string }
  > {
    const user = await this.userRepo.findOne({
      select: ["email", "passwordDigest", "id"],
      where: {
        email: creds.email
      }
    });

    if (!user) {
      return "user-not-found";
    }

    if (await compare(creds.password, user.passwordDigest)) {
      return {
        email: user.email,
        id: user.id
      };
    } else {
      return "invalid-password";
    }
  }

  async isAuthenticatedRequest(request) {
    if (
      !request ||
      ((!request.cookies || !request.cookies.sid) && !request.body.__sid)
    ) {
      return false;
    }
    const sid = request.cookies.sid || request.body.__sid;
    const user = await this.userRepo.findOne({ where: { id: sid } });
    if (user) {
      this.currentUser = user;
      return true;
    } else {
      return false;
    }
  }
}
