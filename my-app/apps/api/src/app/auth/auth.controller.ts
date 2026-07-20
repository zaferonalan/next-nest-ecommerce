import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { ResponseDto } from './dto/response-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  async register(@Body() registerDto: RegisterDto):Promise<ResponseDto>{
    return await this.authService.register(registerDto)
  }
}
