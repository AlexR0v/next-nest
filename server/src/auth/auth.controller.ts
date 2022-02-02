import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards
}                            from '@nestjs/common'
import { AuthGuard }         from '@nestjs/passport'
import { Request, Response } from 'express'
import { AuthService }       from './auth.service'
import { CreateUserDto }     from './dto/createUser.dto'
import { JwtAuthGuard }      from './guards/jwt.guard'

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService){}

  @Post('/register')
  register(@Body() createUser: CreateUserDto){
    return this.authService.register(createUser)
  }

  @Get('/activate/:link')
  async activate(@Param() param, @Res() res: Response){
    const { link } = param
    if (!link) {
      throw new BadRequestException('Link is undefined')
    }
    await this.authService.activate(link)
    res.status(302).redirect(process.env.CLIENT_URL)
  }

  @Get('/reset-password/:link')
  async resetPassword(@Param() param, @Res() res: Response){
    const { link } = param
    if (!link) {
      throw new BadRequestException('Link is undefined')
    }
    return this.authService.resetPassword(link)
  }

  @Post('/forgot-password')
  async forgotPass(@Body() body){
    const { email } = body
    return this.authService.resetPasswordMail(email)
  }

  @Post('/new-password')
  async newPassword(@Body() user: CreateUserDto){
    return this.authService.newPassword(user)
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() body: CreateUserDto, @Res({ passthrough: true }) response: Response){
    const { email } = body
    const { newUser, access_token, refresh_token } = await this.authService.login(email)
    response.cookie('jwt', refresh_token,
      { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return { ...newUser, access_token }
  }

  @UseGuards(AuthGuard('jwt-cookie'))
  @Post('/refresh-token')
  async refreshToken(@Req() req){
    const access_token = await this.authService.refreshToken(req.user.email)
    return { access_token }
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response){
    if (!req.cookies['jwt']) {
      throw new HttpException('User not found', HttpStatus.NO_CONTENT)
    }
    await this.authService.logout(req.cookies['jwt'])
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    return { success: true }
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getAllUsers(){
    return this.authService.getAllUsers()
  }

}
