import { Module }         from '@nestjs/common'
import { ConfigModule }   from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { MailModule } from './mail/mail.module';
import { AuthModule }     from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    MailModule
  ]
})
export class AppModule {}
