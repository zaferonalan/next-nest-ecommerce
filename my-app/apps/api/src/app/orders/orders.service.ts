import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';

@Injectable()
export class OrdersService {
    /**
     *
     */
    constructor(private readonly prisma:PrismaService) {}


    
}
