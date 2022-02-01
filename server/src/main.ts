import { ValidationPipe }       from '@nestjs/common'
import { NestFactory }          from '@nestjs/core'
import * as cookieParser        from 'cookie-parser'
import { AppModule }            from './app.module'
import { corsOptions }          from './config/corsOptions'
import { credentialMiddleware } from './middlewares/credential.middleware'

async function bootstrap(){
  const app = await NestFactory.create(AppModule)
  app.use(credentialMiddleware)
  app.enableCors(corsOptions)
  app.use(cookieParser())
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT)
}

bootstrap()
