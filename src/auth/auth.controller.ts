import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dtos/register.dto'
import { LoginDto } from './dtos/login.dto'
import { Auth } from './decorators/auth.decorator'

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth({ isOpen: true })
  async httpRegisterUser(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto)
    return { success: true, message: 'User registered successfully', data: { user } }
  }

  @Post('login')
  @Auth({ isOpen: true })
  async httpLoginUser(@Body() loginDto: LoginDto) {
    const user = await this.authService.login(loginDto)
    return { success: true, message: 'User logged in successfully', data: user }
  }
}
