import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy }                  from '@nestjs/passport'
import { Request }                           from 'express'
import { Strategy }                          from 'passport-jwt'
import { AuthService }                       from '../auth.service'
import { jwtConstants }                      from '../jwt.constants'

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(
    private readonly authService: AuthService
  ){
    super({
      jwtFromRequest: (req) => {
        if (!req || !req.cookies) return null
        return req.cookies['jwt']
      },
      ignoreExpiration: false,
      secretOrKey: jwtConstants.ACCESS_TOKEN_SECRET,
      passReqToCallback: true
    })
  }

  async validate(req: Request){
    const user = await this.authService.validateUserByCookie(req.cookies['jwt'])
    if (!user) throw new UnauthorizedException()
    return user
  }
}
