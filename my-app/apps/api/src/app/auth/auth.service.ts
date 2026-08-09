import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService, Role } from '@org/database';
import { AuthUser, RegisterInput } from '@org/schemas';
import { AuthTokens } from './types/auth-tokens';
import { UserService } from '../user/user.service';
import { AccessTokenPayload } from './types/access-token-paload';
import { JwtService } from '@nestjs/jwt';
import { refreshConfig } from '@org/config';
import type { ConfigType } from '@nestjs/config';
import { hash,verify} from '../security/crypto';
import { RefreshTokenPayload } from './types/refresh-token-payload';
import { AuthUserDto } from './dto/authUser.dto';

@Injectable()
export class AuthService {
    /**
     *
     */
    constructor(
        private readonly prisma:PrismaService,
        private readonly userService:UserService,
        private readonly jwtService: JwtService,
        @Inject(refreshConfig.KEY)
        private refreshTokenConfig: ConfigType<typeof refreshConfig>
    ) {
    }

    async register(input:RegisterInput){

        const existingUser = await this.userService.findByEmail(input.email)

        if (existingUser) {
            throw new ConflictException("User with this email already exist")
        }

        return this.userService.create(input)
    }


    async login(user:AuthUserDto ):Promise<AuthTokens>{
        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.role)

        const hashedRefreshToken = await hash(refreshToken)
        await this.updateRefreshToken(user.id, hashedRefreshToken)

        return { accessToken, refreshToken }
    }


    async refreshToken(userId: string, role:Role):Promise<AuthTokens>{
        const { accessToken, refreshToken } = await this.generateTokens(userId, role)
        
        const hashedRefresh = await hash(refreshToken)
        await this.updateRefreshToken(userId, hashedRefresh)

        return {
            accessToken,
            refreshToken
        }
    }


    async logouth(userId: string){
        await this.updateRefreshToken(userId, null)
    }



    async generateTokens(userId: string, role: Role):Promise<AuthTokens>{
       const payload:AccessTokenPayload = { sub:userId, role }

       const [ accessToken, refreshToken ] = await Promise.all([
        this.jwtService.signAsync(payload),
        this.jwtService.signAsync(payload, this.refreshTokenConfig)
       ])

       return {
        accessToken,
        refreshToken
       }
    }

    async updateRefreshToken(userId: string, hashedRefresh: string | null){
        return await this.prisma.client.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: hashedRefresh
            }
        })
    }



    async validateLocal(email: string, password: string):Promise<AuthUser>{
        const user = await this.userService.findByEmail(email)

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid Credentials')
        }

        const passwordMach = await verify(user.password, password)

        if(!passwordMach) throw new UnauthorizedException('Invalid Credentials')

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    }

    async validateJwt(payload:AccessTokenPayload):Promise<AuthUser>{

        const user = await this.prisma.client.user.findUnique({
            where: {
                id: payload.sub
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
            }
        })

        if(!user){
            throw new UnauthorizedException('User not found')
        }
        
        if (user.role  !== payload.role) {
            throw new UnauthorizedException('Role changed')
        }


        return user
    }

    async validateRefreshToken(refreshToken: string ,payload:RefreshTokenPayload):Promise<AuthUser> {
        
        const user = await this.prisma.client.user.findUnique({
            where: {
                id: payload.sub
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                refreshToken: true
            }
        })

        if(!user || !user.refreshToken) throw new UnauthorizedException('User not found')

        const isMatch = await verify(user.refreshToken, refreshToken)

        if(!isMatch) throw new UnauthorizedException('Invalid refreshToken')
        
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
        
    }
    
}
