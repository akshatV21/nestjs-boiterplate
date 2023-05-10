import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { DatabaseModule } from 'src/database/database.module'
import { User, UserSchema } from 'src/database/models/user.model'
import { APP_GUARD } from '@nestjs/core'
import { Authorize } from './guards/authorize.guard'

@Module({
  imports: [DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: Authorize }],
})
export class AuthModule {}
