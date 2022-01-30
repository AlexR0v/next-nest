import { ExecutionContext, ForbiddenException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService }                                                                          from '@nestjs/jwt'
import { AuthGuard }                                                                           from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService
  ){super()}

  canActivate(context: ExecutionContext){

    const req = context.switchToHttp().getRequest()

    const token = req.headers?.authorization?.split(' ')[1]
    const decode: any = this.jwtService.decode(token)
    if (Date.now() >= decode.exp * 1000 && decode?.isRefresh) {
      throw new UnauthorizedException()
    }

    return super.canActivate(context)
  }

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
