import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Patch,
  Body,
  Delete
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCookieAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/roles/role.guard';
import { UserResponseDto } from './dto/userResponse.dto';
import { UserService } from './user.service';
import { Roles } from '../auth/decerators/roles.decerators';
import { Role } from '@org/database';
import { ZodResponse } from 'nestjs-zod';
import { AuthUserDto } from '../auth/dto/authUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import type{ AuthenticatedRequest } from '../auth/types/AuthenticatedRequest';
import { ChangePasswordDto } from './dto/changePassword.dto';

@ApiTags('users')
@ApiCookieAuth('jwt')
// @UseGuards(JwtAuthGuard,RoleGuard)
@Controller('users')
export class UserController {
  constructor( private readonly userService:UserService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  @Roles(Role.ADMIN)
  @ZodResponse({
    status: 200,
    description: 'List users',
    type: [UserResponseDto]
  })
  @ApiUnauthorizedResponse({
    description: 'AccessToken missing'
  })
  @ApiForbiddenResponse({
    description: 'Admin role required'
  })
  async findAll():Promise<UserResponseDto[]>{
    return await this.userService.findAll()
  }

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


  @Get(':id')
  @ApiOperation({summary: 'Get user by Id'})
  @Roles(Role.ADMIN)
  @ApiUnauthorizedResponse({description: "User not found"})
  @ApiForbiddenResponse({description: "Admin role required"})
  @ApiNotFoundResponse({description: 'user not found'})
  @ZodResponse({
    status: 200,
    description: '',
    type: UserResponseDto
  })
  async findOne(@Param('id') id: string):Promise<UserResponseDto>{
    return await this.userService.findOne(id)
  }


  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Update current user profile'})
  @ApiBody({
    type: UpdateUserDto
  })
  @ZodResponse({
    status: 200,
    type: UserResponseDto,
    description:'User profile updated successfully'
  })
  @ApiUnauthorizedResponse({description: "Access token missing or invalid"})
  @ApiConflictResponse({description: "Email already in use"})
  @ApiNotFoundResponse({description: 'User not found'})
  async updateProfile( @Request() req:AuthenticatedRequest, @Body() updateUserDto: UpdateUserDto):Promise<UserResponseDto>{
    return await this.userService.update(req.user.id, updateUserDto)
  }


  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Change current user password'})
  @ApiUnauthorizedResponse({description: 'Access token missing or invalid'})
  @ApiBadRequestResponse({description: 'New password must be different from the current password'})
  async changePassword(@Request() req: AuthenticatedRequest, @Body() changePassword: ChangePasswordDto):Promise<{message: string}>{
    return await this.userService.changePassword(req.user.id, changePassword)
  }


  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Delete current user account'})
  @ApiUnauthorizedResponse({description: 'Access token missing or invalid'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiOkResponse({description: 'User account deleted successfully'})
  async deleteAccount(@Request() req:AuthenticatedRequest):Promise<{message: string}>{
    return await this.userService.remove(req.user.id)
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard,RoleGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({summary: 'Delete user by Id'})
  @ApiUnauthorizedResponse({description:'Access token missing or invalid'})
  @ApiNotFoundResponse({description: 'User id not found'})
  @ApiOkResponse({description: 'user with the specified ID deleted successfully'})
  async deleteUser(@Param('id') id: string):Promise<{message: string}>{
    return await this.userService.remove(id)
  }

}
