import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBadRequestResponse, ApiCookieAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/roles/role.guard';
import { ModerateThrottle, RelaxThrottle } from '../decerators/custom-throttler.decerator';
import { ZodResponse } from 'nestjs-zod';
import { OrderApiResponseDto } from './dto/ordersApi-response.dto';
import type { AuthenticatedRequest } from '../auth/types/AuthenticatedRequest';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../decerators/roles.decerators';
import { Role } from '@org/database';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { AuthUserDto } from '../auth/dto/authUser.dto';
import { UpdateOrderDto } from './dto/update-Order.dto';

@ApiTags('orders')
@ApiCookieAuth('accessToken')
@Controller('orders')
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}


  @Post()
  @ApiUnauthorizedResponse({ description: 'accessToken missing'})
  @ModerateThrottle()
  @ApiOperation({ summary: 'Create a new order'})
  @ZodResponse({
    status: 201,
    type: OrderApiResponseDto,
    description: 'Order create successfully'
  })
  @ApiNotFoundResponse({ description: 'Cart not found or empty'})
  @ApiBadRequestResponse({ description: 'Invalid data or instufficient stock'})
  async create(@Body() createOrder:CreateOrderDto, @Request() req:AuthenticatedRequest){
    return await this.ordersService.create(req.user.id, createOrder)
  }



  @Get('admin/all')
  @Roles(Role.ADMIN)
  @RelaxThrottle()
  @ApiOperation({summary: 'Admin get all orders'})
  @ApiQuery({name: 'status', required: false, type: String})
  @ApiQuery({name: 'page', required: false, type: Number})
  @ApiQuery({name: 'limit', required: false, type: Number})
  @ApiUnauthorizedResponse({description: 'accesstoken is missing invalid'})
  @ApiForbiddenResponse({ description: 'Admin access required'})
  @ZodResponse({
    type: PaginationOrderDto,
    description: 'list of orders'
  })
  async findAllForAdmin(@Query() query:QueryOrderDto):Promise<PaginationOrderDto>{
    return await this.ordersService.findAllForAdmin(query)
  }


  @Get()
  @RelaxThrottle()
  @ApiOperation({summary: 'Get all orders for current user'})
  @ApiQuery({name: 'status', required: false, type: String})
  @ApiQuery({name: 'pages', required: false, type: Number})
  @ApiQuery({name: 'limit', required: false, type: Number})
  @ZodResponse({
    description: 'List of user orders',
    type: PaginationOrderDto,
  })
  async findAll(@Query() query:QueryOrderDto, @Request() req: { user:AuthUserDto} ):Promise<PaginationOrderDto>{
    return await this.ordersService.findAll(req.user.id, query)
  }


  @Get('admin/:id')
  @Roles(Role.ADMIN)
  @RelaxThrottle()
  @ApiOperation({summary: 'Get order ny Id'})
  @ZodResponse({
    description: 'Order details',
    type: OrderApiResponseDto
  })
  @ApiNotFoundResponse({ description: 'Order not found'})
  @ApiForbiddenResponse({description: 'Admin access required'})
  async findOneAdmin(@Param('id') id: string, ):Promise<OrderApiResponseDto>{
    return await this.ordersService.findOneAdmin(id)
  }



  @Get(':id')
  @RelaxThrottle()
  @ApiOperation({summary: 'Get an order by ID for current user'})
  @ZodResponse({
    description: 'Order details',
    type:OrderApiResponseDto
  })
  @ApiNotFoundResponse({description: 'Order not found'})
  async findOne(@Param('id') id: string, @Request() req: {user: AuthUserDto}):Promise<OrderApiResponseDto>{
    return await this.ordersService.findOne(id, req.user.id)
  }

  @Patch('admin/:id')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  @ApiOperation({summary: 'Admin update any order'})
  @ApiNotFoundResponse({description: 'Order not found'})
  @ApiForbiddenResponse({description: 'Admin access required'})
  @ApiParam({name: 'id', description: 'Order ID'})
  @ZodResponse({
    description: 'Order updated successfully',
    type: OrderApiResponseDto
  })
  async updateAdmin(@Param('id') id: string, @Body() updateDto:UpdateOrderDto){
    return await this.ordersService.updateAdmin(id, updateDto)
  }

  @Patch(':id')
  @ModerateThrottle()
  @ApiOperation({summary: 'update your own order'})
  @ApiParam({ name: 'id' , description: 'Order ID'})
  @ZodResponse({
    type: OrderApiResponseDto,
    description: 'Order update successfully'
  })
  @ApiNotFoundResponse({description: 'Order not found'})
  async update(@Param('id') id:string, @Body() dto:UpdateOrderDto, @Request() req:{ user: AuthUserDto}):Promise<OrderApiResponseDto>{
    return await this.ordersService.update(id, dto, req.user.id)
  }


  @Patch('admin/:id')
  @Roles(Role.ADMIN)
  @ModerateThrottle()
  @ApiOperation({summary: 'Admin cancel order by Id'})
  @ApiParam({name: 'id', description: 'Order ID'})
  @ZodResponse({
    type: OrderApiResponseDto,
    description: 'Order cancelled'
  })
  @ApiNotFoundResponse({description: 'Order not found'})
  async cacelAdmin(@Param('id') id: string ):Promise<OrderApiResponseDto>{
    return await this.ordersService.cancelledAdmin(id)
  }


  @Patch(':id')
  @ModerateThrottle()
  @ApiOperation({summary: 'User cancel order by Id'})
  @ApiParam({name: 'id', description: 'Order ID'})
  @ZodResponse({
    type: OrderApiResponseDto,
    description: 'Order cancelled'
  })
  @ApiNotFoundResponse({description: 'Order not found'})
  async cancel(@Param('id') id: string, @Request() req: {user: AuthUserDto} ):Promise<OrderApiResponseDto>{
    return await this.ordersService.cancelled(id, req.user.id)
  }
}
