import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCookieAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/roles/role.guard';
import { Roles } from '../auth/decerators/roles.decerators';
import { Role } from '@org/database';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ZodResponse } from 'nestjs-zod';
import { QueryCategoryDto } from './dto/query-category.dto';
import { CategoryListResponseDto } from './dto/categoryList-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('accessToken')
  @ApiOperation({summary: 'Create a new category'})
  @ApiBody({type: CreateCategoryDto})
  @ZodResponse({
    status: 201,
    type:CategoryResponseDto,
    description: 'Category created successfully'
  })
  @ApiUnauthorizedResponse({description: 'AccessToken missing or invalid'})
  @ApiForbiddenResponse({description: 'Admin role required'})
  @ApiBadRequestResponse({description: 'Invalid category data'})
  async create(@Body() createCategoryDto:CreateCategoryDto):Promise<CategoryResponseDto>{
    return await this.categoryService.create(createCategoryDto)
  }

  @Get()
  @ApiOperation({summary: 'Get all categories'})
  @ZodResponse({
    status: 200,
    type: CategoryListResponseDto,
    description: 'List all categories'
  })
  async findAll(@Query() queryDto:QueryCategoryDto):Promise<CategoryListResponseDto>{
    return await this.categoryService.findAll(queryDto)
  }

  @Get(':id')
  @ApiOperation({summary: 'get category by ID'})
  @ZodResponse({
    status: 200,
    type: CategoryResponseDto,
    description: 'Category details'
  })
  @ApiNotFoundResponse({description: 'Category not found'})
  async findOne(@Param() id: string):Promise<CategoryResponseDto>{
    return await this.categoryService.findOne(id)
  }


  @Get('slug/:slug')
  @ZodResponse({
    status: 200,
    type: CategoryResponseDto,
    description: 'category details'
  })
  @ApiNotFoundResponse({description: 'Category not found'})
  async findBySlug(@Param('slug') slug: string):Promise<CategoryResponseDto>{
    return await this.categoryService.findBySlug(slug)
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('accessToken')
  @ApiUnauthorizedResponse({description: 'AccessToken is missing invalid'})
  @ApiNotFoundResponse({description: 'Category not found'})
  @ApiConflictResponse({description: 'Category slug already'})
  @ZodResponse({
    status:200,
    type: CategoryResponseDto,
    description: 'category update successfully'
  })
  async update(@Param('id') id: string, @Body() updateCategoryDto:UpdateCategoryDto):Promise<CategoryResponseDto>{
    return await this.categoryService.update(id, updateCategoryDto)
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('accessToken')
  @ApiOperation({summary: 'Delete category'})
  @ApiOkResponse({description: 'Cannot delete category with products'})
  @ApiUnauthorizedResponse({description: 'AccessToken is missing invalid'})
  async remove(@Param('id') id: string):Promise<{message: string}>{
    return await this.categoryService.remove(id)
  }
}
