import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService }                                                                      from '@nestjs/jwt'
import { InjectModel }                                                                     from '@nestjs/mongoose'
import * as bcrypt                                                                         from 'bcrypt'
import { Model }                                                                           from 'mongoose'
import { CreateUserDto }                                                                   from './dto/createUser.dto'
import { UserDto }                                                                         from './dto/newUser.dto'
import { User, UserDocument }                                                              from './models/user.model'

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ){}

  async register(createUser: CreateUserDto): Promise<{ success: boolean }>{
    const { username, password } = createUser
    const user: User = await this.userModel.findOne({ username })
    if (user) {
      throw new ConflictException(HttpStatus.CONFLICT, `User with this username already exist`)
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const newUser = new this.userModel({ username, password: hashPassword })
    newUser.isActivate = false
    await newUser.save()
    return { success: true }
  }

  async login(username: string){
    const user = await this.userModel.findOne({ username })
    const payload = { username: user.username }
    const access_token = this.jwtService.sign(payload)
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '86400s' })
    user.refresh_token = refresh_token
    user.save()
    const newUser = new UserDto(user)
    return { newUser, access_token, refresh_token }
  }

  async refreshToken(username: string){
    const user = await this.userModel.findOne({ username })
    const payload = { username: user.username }
    return this.jwtService.sign(payload)
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

  validateUserByCookie(refresh_token: string){
    return this.userModel.findOne({ refresh_token })
  }

  async logout(refresh_token: string){
    const user = await this.userModel.findOne({ refresh_token })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NO_CONTENT)
    }
    user.refresh_token = null
    user.save()
    return user
  }

  async getAllUsers(){
    const users = await this.userModel.find()
    return users.map(item => new UserDto(item))
  }
}
