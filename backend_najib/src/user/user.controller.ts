import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Req, UsePipes, ValidationPipe, ParseIntPipe, ForbiddenException, Res } from "@nestjs/common";
import { User } from "src/entity/user.entity";
import { UserIdService } from "./user.id_service";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import type { Response } from 'express';

import { LoginDto } from "src/pipes/loginDTO";
import type { RequestWithSession } from "./session.interface";
import { CreateUserDto } from "src/pipes/userDTO";


@Controller("users")
export class UserController {
  constructor(
    private readonly userIdService: UserIdService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) { }

  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const id = await this.userIdService.createUserId(createUserDto);
    return { message: "User created successfully", user_id: id };
  }


  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getUser(
    @Param("id", ParseIntPipe) id: number, @Req() req: RequestWithSession) {
    if (req.session.user.user_id !== id) {
      throw new ForbiddenException("This is not your ID");
    }
    return this.userIdService.getUserById(id);
  }

 
  @UseGuards(JwtAuthGuard)
  @Put("update/:id")
  async updateUser(
    @Param("id", ParseIntPipe) id: number, @Body() userData: Partial<User>,) {

    const updatedUser = await this.userIdService.updateUser(id, userData);
    return { message: "User updated successfully", updatedUser };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteUser(@Param("id") id: number) {
    await this.userIdService.deleteUser(Number(id));
    return { message: "User deleted successfully" };
  }

  // @Post("login")
  // @UsePipes(ValidationPipe)
  // async login(@Body() body: LoginDto, @Req() req: RequestWithSession) {
  //   const { user, token } = await this.userIdService.login(body.userId, body.password);
  //   req.session.user = user;
  //   const newuser = req.session.user;

  //   if(user&&token){
  //   return {
  //     message: "Login successful",
  //     newuser,
  //     access_token: token
  //   };
  // }
  // else{
  //   return {
  //     message: "Login unsuccessful",
  //   };
  // }
  // }



  @Post("login")
  @UsePipes(ValidationPipe)
  async login(
    @Body() body: LoginDto, @Req() req: RequestWithSession, @Res({ passthrough: true }) res: Response) {
    const { user, token } = await this.userIdService.login(body.userId, body.password);
    req.session.user = user;
    const newuser = req.session.user;
    if (user && token) {
     return {
        message: "Login successful",
        newuser,token
      };
    } else {
      return {
        message: "Login unsuccessful",
      };
    }
  }

@UseGuards(JwtAuthGuard)
@Get()
async getUserWithoutId(@Req() req: RequestWithSession) {
  const user = req.session?.user; 
  if (!user) {
    return { message: "User not logged in" };
  }
  return { user };
}

@UseGuards(JwtAuthGuard)
@Post('logout')
async logout(@Req() req: RequestWithSession, @Res({ passthrough: true }) res: Response) {
  return new Promise((resolve, reject) => {
    if (!req.session) {
      return resolve({ message: 'No active session' });
    }

    // Destroy full session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return reject({ message: 'Logout failed' });
      }

      // Clear session cookie in browser
      res.clearCookie('connect.sid', { path: '/' }); // default session cookie name
      resolve({ message: 'All session data cleared. Logged out successfully' });
    });
  });
}




}

