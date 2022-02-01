import { Module }             from '@nestjs/common'
import { JwtModule }          from '@nestjs/jwt'
import { MongooseModule }     from '@nestjs/mongoose'
import { PassportModule }     from '@nestjs/passport'
import { AuthController }     from './auth.controller'
import { AuthService }        from './auth.service'
import { jwtConstants }       from './jwt.constants'
import { User, UserModel }    from './models/user.model'
import { JwtCookiesStrategy } from './strateges/jwt-cookie.strategy'
import { JwtStrategy }        from './strateges/jwt.strategy'
import { LocalStrategy }      from './strateges/local.strategy'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserModel }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtCookiesStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
