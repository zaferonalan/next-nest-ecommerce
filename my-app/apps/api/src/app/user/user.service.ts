import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@org/database';
import { CreateUserInput } from '@org/schemas';
import { hash, verify } from '../security/crypto';
import type { ChangePasswordType, UpdateUser, UserResponseInput } from '@org/schemas'

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


    async findOne(userId: string):Promise<UserResponseInput>{
        const user = await this.prisma.client.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return {
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        }
    }

    async findAll():Promise<UserResponseInput[]>{
        const users = await this.prisma.client.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { createdAt: 'desc' }
        })

        return users.map((user) => ({
            ...user,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        }))
    }

    async update(userId:string, updateUserDto:UpdateUser):Promise<UserResponseInput>{
        const existingUser = await this.prisma.client.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!existingUser) {
            throw new NotFoundException('User not found')
        }

        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            
            const emailTaken = await this.prisma.client.user.findUnique({
                where: {
                    email: updateUserDto.email
                }
            })

            if(emailTaken){
                throw new ConflictException('Email is already taken')
            }
        }

        
        const updateUser = await this.prisma.client.user.update({
            where: { id: userId },
            data: updateUserDto,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        return {
            ...updateUser,
            createdAt: updateUser.createdAt.toISOString(),
            updatedAt: updateUser.updatedAt.toISOString()
        }

    }


    async changePassword(userId: string, changePassword:ChangePasswordType):Promise<{message: string}>{
        const { currentPassword, newPassword } = changePassword

        const user = await this.prisma.client.user.findUnique({
            where:{
                id: userId
            }
        })

        if(!user){
            throw new NotFoundException('user not found')
        }

        const isPasswordValid = await verify(user.password, currentPassword)

        if (!isPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect')
        }

        const isSamePassword = await verify(user.password, newPassword)

        if(isSamePassword){
            throw new BadRequestException('New password must be different from the currentPassword')
        }

        const hashedNewPassword = await hash(newPassword)

        await this.prisma.client.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedNewPassword
            }
        })

        return { message: 'Password changed successfully'}
    }

    async remove(userId:string):Promise<{message: string}>{
        
        const user = await this.prisma.client.user.findUnique({
            where: {id: userId}
        })

        if(!user){
            throw new NotFoundException('User not found')
        }

        await this.prisma.client.user.delete({
            where:{ id:userId }
        })

        return { message: 'User account deleted successfully'}
    }
}
