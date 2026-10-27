import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';
import { CreatePaymentApiResponseType, CreatePaymentType } from '@org/schemas';

@Injectable()
export class PaymentService {
    
    constructor(private readonly prisma:PrismaService) {}


    async createPayment(userId: string, createPayment:CreatePaymentType):Promise<CreatePaymentApiResponseType>{
        
    }
}
