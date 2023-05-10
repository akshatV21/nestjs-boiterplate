import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from '../auth.service'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { verify } from 'jsonwebtoken'
import { AuthOptions } from 'src/utils/interfaces'

@Injectable()
export class Authorize implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { isLive, isOpen } = this.reflector.get<AuthOptions>('authOptions', context.getHandler())

    if (!isLive)
      throw new InternalServerErrorException(
        'This is endpoint is currently under maintainance. Please try again after some time.',
      )
    if (isOpen) return true

    const request = context.switchToHttp().getRequest()

    const authHeader = request.headers['authorization']
    if (!authHeader) throw new UnauthorizedException('Please log in first.')

    const token = authHeader.split(' ')[1]
    const { id } = this.validateToken(token)

    const user = await this.authService.getUserById(id)
    if (!user) throw new BadRequestException('Invalid user id.')

    request.user = user
    return true
  }

  private validateToken(token: string): any {
    return verify(token, this.configService.get('JWT_SECRET'), (err, payload) => {
      // when jwt is valid
      if (!err) return payload

      // when jwt has expired
      if (err.name === 'TokenExpiredError') throw new UnauthorizedException('Please log in again')

      // throws error when jwt is malformed
      throw new UnauthorizedException('Invalid Jwt token')
    })
  }
}
