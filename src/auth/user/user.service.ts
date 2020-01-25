import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import { hash } from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  async userSignup(user: CreateUserDTO): Promise<User> {
    const u: User = new User();
    u.email = user.email;
    u.firstName = user.firstName;
    u.passwordDigest = await hash(user.password, 10);
    return this.userRepo.save(u);
  }
}
