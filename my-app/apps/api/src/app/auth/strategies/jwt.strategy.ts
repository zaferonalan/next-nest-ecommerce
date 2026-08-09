import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConfig } from '@org/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RequestWithCookies } from '../types/request-with-cookies';
import { AccessTokenPayload } from '../types/access-token-paload';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
        @Inject(jwtConfig.KEY)
        config: ConfigType<typeof jwtConfig>,
        private authService:AuthService
    ) {
    super({
        jwtFromRequest: ExtractJwt.fromExtractors([
            (req: RequestWithCookies) => req.cookies?.accessToken ?? null
        ]),
        
        ignoreExpiration: false,
        secretOrKey: config.secret
    });
  }

  async validate(payload: AccessTokenPayload) {
    
    return this.authService.validateJwt(payload)

  }
}
