import { Module }            from '@nestjs/common'
import { ConfigModule }      from '@nestjs/config'
import { MongooseModule }    from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'
import * as path             from 'path'
import { AuthModule }        from './auth/auth.module'
import { FileModule }        from './file/file.module'
import { MailModule }        from './mail/mail.module'
import { TrackModule }       from './track/track.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static') }),
    TrackModule,
    FileModule,
    AuthModule,
    MailModule
  ]
})
export class AppModule {}
