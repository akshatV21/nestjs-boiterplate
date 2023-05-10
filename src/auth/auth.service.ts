import { BadRequestException, Injectable } from '@nestjs/common'
import { RegisterDto } from './dtos/register.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from 'src/database/models/user.model'
import { Model } from 'mongoose'
import { LoginDto } from './dtos/login.dto'
import { compareSync } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = new this.UserModel<User>(registerDto)
    await user.save()

    const { password, rest } = user._doc
    return rest
  }

  async login(loginDto: LoginDto) {
    const registeredUser = await this.UserModel.findOne({ email: loginDto.email })
    if (!registeredUser) throw new BadRequestException('No registered user with provided email.')

    const passwordMatches = compareSync(loginDto.password, registeredUser.password)
    if (!passwordMatches) throw new BadRequestException('Invalid password provided.')

    const token = sign({ id: registeredUser.id }, this.configService.get('JWT_SECRET'), { expiresIn: '24h' })
    const { password, rest } = registeredUser._doc

    return { user: rest, token }
  }
}
