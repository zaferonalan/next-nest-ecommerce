import { Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';
import { CreateUserInput } from '@org/schemas';
import { hash } from '../security/crypto';

@Injectable()
export class UserService {
    /**
     *
     */
    constructor(private readonly prisma: PrismaService) {}


    async create(createUserDto:CreateUserInput){
        const { password, ...user } = createUserDto

        const hashedPassword = await hash(password)

        return await this.prisma.client.user.create({
            data: {
                ...user, password:hashedPassword
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
            }
        })
    }

    async findByEmail(email: string){
        return await this.prisma.client.user.findUnique({
            where: { email }
        })
    }


    async findOne(userId: string){
        return await this.prisma.client.user.findUnique({
            where: {
                id: userId
            }
        })
    }
}
