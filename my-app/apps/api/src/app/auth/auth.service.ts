import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@org/database';
import { RegisterInput, ResponseInput } from '@org/schemas';
import { hashPassword } from '../security/password';

@Injectable()
export class AuthService {
    /**
     *
     */
    constructor(private readonly prisma:PrismaService) {
    }

    async register(input:RegisterInput):Promise<ResponseInput>{
        const { email, password, firstName, lastName } = input

        const existingUser = await this.prisma.client.user.findUnique({
            where: {email},
        })

        if (existingUser) {
            throw new ConflictException("User with this email already exist")
        }

        try {
            const hashedPassword = await hashPassword(password)
            const user = await this.prisma.client.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                }
            })
        } catch (error) {
            
        }
    }
}
