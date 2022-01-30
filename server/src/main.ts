import { ValidationPipe } from '@nestjs/common'
import { NestFactory }    from '@nestjs/core'
import * as cookieParser  from 'cookie-parser'
import { AppModule }      from './app.module'

async function bootstrap(){
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: 'http://localhost:3123',
    credentials: true
  })
  app.use(cookieParser())
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT)
}

bootstrap()
