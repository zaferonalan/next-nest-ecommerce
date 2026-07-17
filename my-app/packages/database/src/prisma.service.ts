import { Injectable,OnModuleDestroy,OnModuleInit } from '@nestjs/common';
import { prisma } from "./client.js";

@Injectable()
export class PrismaService implements OnModuleDestroy, OnModuleInit {
  
    async onModuleDestroy() {
        await prisma.$disconnect();
        console.log("Prisma disconnected");
    }

    async onModuleInit() {
        await prisma.$connect();
        console.log("Prisma conected to the database");
    }

    get client() {
        return prisma
    }
}
