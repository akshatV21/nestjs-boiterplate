import { Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dtos/register.dto'
import { LoginDto } from './dtos/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async httpRegisterUser(registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto)
    return { success: true, message: 'User registered successfully', data: { user } }
  }

  @Post('login')
  async httpLoginUser(loginDto: LoginDto) {
    const user = await this.authService.login(loginDto)
    return { success: true, message: 'User logged in successfully', data: user }
  }
}
