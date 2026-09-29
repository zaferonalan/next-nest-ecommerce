import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCookieAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/roles/role.guard';
import { Roles } from '../auth/decerators/roles.decerators';
import { Role } from '@org/database';
import { ZodResponse } from 'nestjs-zod';
import { ProductResponseDto } from './dto/product-response.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStockDto } from './dto/update-productStock.dto';
import { ProductListResponseDto } from './dto/productList-response.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('accessToken')
  @ApiOperation({summary: 'Create a new Product'})
  @ApiConflictResponse({description: 'Sku already exists'})
  @ApiForbiddenResponse({description: 'Admin role required'})
  @ApiUnauthorizedResponse({description: 'AccessToken is missing invalid'})
  @ZodResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  async create(@Body() createProduct:CreateProductDto):Promise<ProductResponseDto>{
    return await this.productsService.create(createProduct)
  }


  @Get()
  @ZodResponse({
    description: 'Products retrieved successfully',
    type:ProductListResponseDto
  })
  @ApiOperation({summary: 'Get all product with optional filters'})
  async findAll(@Query() queryDto:QueryProductDto){
    return await this.productsService.findAll(queryDto)
  }


  @Get(':id')
  @ApiOperation({summary: 'Get product By id'})
  @ZodResponse({
    status: 200,
    type: ProductResponseDto,
    description: 'Product details'
  })
  @ApiNotFoundResponse({description: 'Product not found'})
  async findOne(@Param('id') id: string):Promise<ProductResponseDto>{
    return await this.productsService.findOne(id)
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('accessToken')
  @ApiOperation({summary: 'Update a product'})
  @ApiUnauthorizedResponse({description: 'accesstoken is missing invalid'})
  @ZodResponse({
    status: 200,
    type: ProductResponseDto,
    description: 'Product updated successfully'
  })
  @ApiConflictResponse({description: 'Sku already exists'})
  @ApiNotFoundResponse({description: 'Product not found'})
  @ApiBody({type: UpdateProductDto})
  async update(@Param('id') id: string, @Body() updateProduct:UpdateProductDto):Promise<ProductResponseDto>{
    return await this.productsService.update(id, updateProduct)
  }


  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('accessToken')
  @ApiOperation({summary: 'Update product stock'})
  @ApiUnauthorizedResponse({description: 'accesstoken is missing invalid'})
  @ApiBadRequestResponse({description: 'Insufficiet stock'})
  @ApiNotFoundResponse({description: 'Product notfound'})
  @ZodResponse({
    status: 200,
    description: 'Stock updated successfully',
    type: ProductResponseDto
  })
  async updateSAtock(@Param('id') id: string, @Body() updateStock: UpdateProductStockDto):Promise<ProductResponseDto>{
    return await this.productsService.updateStock(id, updateStock.quantity)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @ApiCookieAuth('accessToken')
  @ApiOperation({summary: 'Delete product'})
  @ApiOkResponse({description: 'Product deleted successfully'})
  @ApiNotFoundResponse({ description: 'Product not found'})
  @ApiUnauthorizedResponse({ description: 'accessToken is missing invalid'})
  @ApiBadRequestResponse({ description: 'Cannot delete product in active orders'})
  async remove(@Param('id') id: string):Promise<{message: string}>{
    return await this.productsService.remove(id)
  }
}
