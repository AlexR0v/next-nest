import { Injectable }           from '@nestjs/common'
import { PassportStrategy }     from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants }         from '../jwt.constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(){
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.ACCESS_TOKEN_SECRET
    })
  }

  async validate(payload: any){
    return { username: payload.username }
  }
}
