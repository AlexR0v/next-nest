import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy }                  from '@nestjs/passport'
import { Strategy }                          from 'passport-local'
import { AuthService }                       from '../auth.service'
import { UserDto }                           from '../dto/newUser.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService){
    super({
      usernameField: 'email',
      passwordField: 'password'
    })
  }

  async validate(email: string, password: string): Promise<UserDto>{
    const user = await this.authService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException()
    }
    return new UserDto(user)
  }
}
