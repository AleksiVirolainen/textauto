import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";

const accounts: Array<{ username: string; password: string; role: string }> = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "operator", password: "operator123", role: "operator" },
  { username: "13057799720", password: "wch20030914", role: "operator" },
  { username: "15058303899", password: "123456..", role: "operator" },
  { username: "19157997572", password: "pa123456789", role: "operator" },
  { username: "15957736312", password: "guhao123", role: "operator" }
];

@Controller("auth")
export class AuthController {
  @Post("login")
  login(@Body() body: LoginDto) {
    const matched = accounts.find(
      (account) => account.username === body.username && account.password === body.password
    );
    if (!matched) {
      throw new UnauthorizedException("用户名或密码错误");
    }
    return {
      token: `mock-token-${matched.username}-${Date.now()}`,
      user: {
        username: matched.username,
        role: matched.role
      }
    };
  }
}
