import { Module }                 from '@nestjs/common'
import { ConfigModule }           from '@nestjs/config'
import { JwtModule }              from '@nestjs/jwt'
import { MongooseModule }         from '@nestjs/mongoose'
import { PassportModule }         from '@nestjs/passport'
import { MailModule }             from '../mail/mail.module'
import { Comment, CommentSchema } from '../track/schemas/comment.schema'
import { AuthController }         from './auth.controller'
import { AuthService }            from './auth.service'
import { User, UserModel }        from './models/user.model'
import { JwtCookiesStrategy }     from './strateges/jwt-cookie.strategy'
import { JwtStrategy }            from './strateges/jwt.strategy'
import { LocalStrategy }          from './strateges/local.strategy'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserModel }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.ACCESS_JWT_SECRET,
      signOptions: { expiresIn: process.env.EXPIRES_ACCESS_TOKEN }
    }),
    MailModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtCookiesStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy]
})
export class AuthModule {}
