import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBadGatewayResponse, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ZodResponse } from 'nestjs-zod';
import { CreatePaymentApiResponseDto } from './dto/createPaymentApi-response.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthUserDto } from '../auth/dto/authUser.dto';

@Controller('payment')
@ApiTags('payments')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('accessToken')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}



  @Post('create-intent')
  @ApiOperation({
    summary: 'create payment intent ',
    description: 'Create a payment intent for an order'
  })
  @ZodResponse({
    description: 'Payment intent created successfully',
    type: CreatePaymentApiResponseDto
  })
  @ApiBadGatewayResponse({ description: 'invalid date or order not found'})
  async createPayment(@Body() createPayment:CreatePaymentDto, @Request() req: { user: AuthUserDto }):Promise<CreatePaymentApiResponseDto>{
    return await this.paymentService.createPayment(req.user.id, createPayment)
  }
}
