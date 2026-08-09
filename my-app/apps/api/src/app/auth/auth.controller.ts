import { Body, Controller, Post, UseGuards, Request, Res, Get, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { AuthUserDto } from './dto/authUser.dto';
import type{ Response } from "express";
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { ApiConflictResponse, ApiCookieAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
// import { SuccessDto } from './dto/success.dto';
// import { LoginDto } from './dto/login-dto';
// import { LoginDto } from './dto/login-dto';


const COOKIE_OPTIONS = {
    httpOnly: true, 
    secure: false, 
    sameSite: "lax" as const
  }

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @ApiOperation({
    summary: 'Get current user'
  })
  @ApiCookieAuth('accessToken')
  @ApiUnauthorizedResponse({description: 'Access token missing or invalid'})
  @UseGuards(JwtAuthGuard)
  @ZodResponse({
    type: AuthUserDto
  })
  @Get('me')
  async getMe(@Request() req: { user: AuthUserDto}){
    return req.user
  }


  @ApiOperation({
    summary: "Register a new user"
  })
  @ApiConflictResponse({description: 'Email already in use'})
  @ZodResponse({
    status: 201,
    description: "User successfully registered",
    type:AuthUserDto
  })
  @Post('signup')
  async register(@Body() registerDto: RegisterDto){
    return await this.authService.register(registerDto)
  }


  @ApiOperation({
    summary: "Sign in"
  })
// @ApiBody({
//   schema: {
//     type: 'object',
//     properties: {
//       email: {
//         type: 'string',
//         format: 'email',
//         example: 'user@example.com',
//       },
//       password: {
//         type: 'string',
//         example: 'Password123!',
//       },
//     },
//     required: ['email', 'password'],
//   },
// })
  @ApiUnauthorizedResponse({description: 'Invalid credentials'})
  @ZodResponse({
    description: "Signed in successfully",
    type: AuthUserDto
  })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(
    @Request() req: {user: AuthUserDto},
    @Res({passthrough: true}) res:Response
  ):Promise<AuthUserDto>{
    const tokens = await this.authService.login(req.user)

    res.cookie("accessToken", tokens.accessToken, COOKIE_OPTIONS)
    res.cookie("refreshToken", tokens.refreshToken, COOKIE_OPTIONS)

    return req.user
  }



  @ApiOperation({
    summary: "Logout"
  })
  @ApiCookieAuth('accessToken')
  @ApiUnauthorizedResponse({description: 'Access token missing or invalid'})
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: {user: AuthUserDto}, @Res({passthrough: true}) res: Response ){
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    await this.authService.logouth(req.user.id)

    return { success: true}
  }
  

  @ApiOperation({
    summary: "Refresh token"
  })
  @ApiCookieAuth('refreshToken')
  // @ApiOkResponse({description: 'Token refreshed successfully', schema: { properties: { success: { type: 'boolean', example: true} } }})
  @ApiUnauthorizedResponse({description: 'Refresh token missing or invalid'})
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req: { user: AuthUserDto}, @Res({passthrough: true}) res: Response){
    const{ accessToken, refreshToken } = await this.authService.refreshToken(req.user.id, req.user.role)

    res.cookie('accessToken',accessToken, COOKIE_OPTIONS)
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)

    return { success: true }
  }
}
