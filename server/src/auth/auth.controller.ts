import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard }                              from '@nestjs/passport'
import { AuthService }                            from './auth.service'
import { CreateUserDto }                          from './dto/createUser.dto'
import { JwtAuthGuard }                           from './guards/jwt.guard'

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService){}

  @Post('/register')
  register(@Body() createUser: CreateUserDto){
    return this.authService.register(createUser)
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(@Body() body){
    const { username } = body
    return this.authService.login(username)
  }

  @UseGuards(AuthGuard('local'))
  @Post('/refresh-token')
  refreshToken(@Body() body){
    const { username } = body
    return this.authService.refreshToken(username)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers(){
    return this.authService.getAllUsers()
  }

}
