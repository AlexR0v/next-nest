import { ForbiddenException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard }                                                         from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(){super()}

  handleRequest(err, user, info){
    if (info?.name === 'TokenExpiredError') {
      throw new ForbiddenException(HttpStatus.FORBIDDEN, 'Token expired')
    }
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
