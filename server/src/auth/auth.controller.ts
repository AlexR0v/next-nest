import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard }                                        from '@nestjs/passport'
import { Request, Response }                                from 'express'
import { AuthService }                                      from './auth.service'
import { CreateUserDto }                                    from './dto/createUser.dto'
import { JwtAuthGuard }                                     from './guards/jwt.guard'

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService){}

  @Post('/register')
  register(@Body() createUser: CreateUserDto){
    return this.authService.register(createUser)
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() body, @Res({ passthrough: true }) response: Response){
    const { username } = body
    const { newUser, access_token, refresh_token } = await this.authService.login(username)
    response.cookie('jwt', refresh_token,
      { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 })
    return { ...newUser, access_token }
  }

  @UseGuards(AuthGuard('jwt-cookie'))
  @Post('/refresh-token')
  async refreshToken(@Req() req){
    const access_token = await this.authService.refreshToken(req.user.username)
    return { access_token }
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response){
    await this.authService.logout(req.cookies['jwt'])
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    return res.sendStatus(200)
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getAllUsers(){
    return this.authService.getAllUsers()
  }

}
