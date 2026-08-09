import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { refreshConfig } from "@org/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { RequestWithCookies } from "../types/request-with-cookies";
import { RefreshTokenPayload } from "../types/refresh-token-payload";
import { AuthService } from "../auth.service";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh-jwt"){
    
    constructor(
        @Inject(refreshConfig.KEY)
        config: ConfigType<typeof refreshConfig>,
        private readonly authService:AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: RequestWithCookies) => req.cookies?.refreshToken ?? null
            ]),
            secretOrKey: config.secret,
            ignoreExpiration: false,
            passReqToCallback: true
        });
        
    }

    async validate(req: RequestWithCookies, payload:RefreshTokenPayload) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new UnauthorizedException('RefreshToken not found')
        return await this.authService.validateRefreshToken(refreshToken, payload)
    }
}