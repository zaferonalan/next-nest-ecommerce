import { Controller, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/roles/role.guard';

@ApiTags('orders')
@ApiCookieAuth('accessToken')
@Controller('orders')
@UseGuards(JwtAuthGuard, RoleGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

}
