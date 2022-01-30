import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService }                                                       from '@nestjs/jwt'
import { InjectModel }                                                      from '@nestjs/mongoose'
import * as bcrypt                                                          from 'bcrypt'
import { Model }                                                            from 'mongoose'
import { CreateUserDto }                                                    from './dto/createUser.dto'
import { UserDto }                                                          from './dto/newUser.dto'
import { User, UserDocument }                                               from './models/user.model'

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ){}

  async register(createUser: CreateUserDto): Promise<UserDto>{
    const { username, password } = createUser
    const user: User = await this.userModel.findOne({ username })
    if (user) {
      throw new ConflictException(HttpStatus.CONFLICT, `User with this username already exist`)
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const newUser = new this.userModel({ username, password: hashPassword })
    await newUser.save()
    const payload = { username: newUser.username, id: newUser._id }
    const access_token = this.jwtService.sign(payload)
    return new UserDto(newUser, access_token)
  }

  async login(username: string){
    const user = await this.userModel.findOne({ username })
    const payload = { username: user.username, isRefresh: false }
    const access_token = this.jwtService.sign(payload)
    return new UserDto(user, access_token)
  }

  async refreshToken(username: string){
    const user = await this.userModel.findOne({ username })
    const payload = { username: user.username, isRefresh: true }
    const access_token = this.jwtService.sign(payload, { expiresIn: '86400s' })
    return new UserDto(user, access_token)
  }

  async validateUser(username: string, password: string): Promise<any>{
    const user = await this.userModel.findOne({ username })
    if (!user) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, `User with this username not found`)
    }
    const matchPass = await bcrypt.compare(password, user.password)
    if (!matchPass) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, `Password incorrect`)
    }
    if (user && matchPass) {
      return new UserDto(user)
    }
    return null
  }

  async getAllUsers(){
    const users = await this.userModel.find()
    return users.map(item => new UserDto(item))
  }
}
