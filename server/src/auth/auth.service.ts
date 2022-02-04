import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService }                                                                      from '@nestjs/jwt'
import { InjectModel }                                                                     from '@nestjs/mongoose'
import * as bcrypt                                                                         from 'bcrypt'
import { Model }                                                                           from 'mongoose'
import { v4 as uuidv4 }                                                                    from 'uuid'
import { MailService }                                                                     from '../mail/mail.service'
import { CreateUserDto }                                                                   from './dto/createUser.dto'
import { UserDto }                                                                         from './dto/newUser.dto'
import { User, UserDocument }                                                              from './models/user.model'

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailService: MailService
  ){}

  async register(createUser: CreateUserDto): Promise<{ success: boolean }>{
    const { email, password, username } = createUser
    const user: User = await this.userModel.findOne({ email })
    const userName: User = await this.userModel.findOne({ username })
    if (user) {
      throw new ConflictException(HttpStatus.CONFLICT, `User with this email already exist`)
    }
    if (userName) {
      throw new ConflictException(HttpStatus.CONFLICT, `User with this username already exist`)
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const activationLink = uuidv4()
    const newUser = new this.userModel({ username, email, password: hashPassword, link: activationLink })
    newUser.isActivate = false
    await this.mailService.sendUserConfirmation(newUser)
    await newUser.save()
    return { success: true }
  }

  async activate(link: string){
    const user = await this.userModel.findOne({ link })
    if (!user) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, `User not found`)
    }
    user.isActivate = true
    await user.save()
  }

  async login(email: string): Promise<{ newUser: UserDto, access_token: string, refresh_token: string }>{
    const user = await this.userModel.findOne({ email })
    const payload = { email: user.email }
    const access_token = this.jwtService.sign(payload)
    const refresh_token = this.jwtService.sign(payload, { expiresIn: process.env.EXPIRES_REFRESH_TOKEN })
    user.refresh_token = refresh_token
    user.save()
    const newUser = new UserDto(user)
    return { newUser, access_token, refresh_token }
  }

  async refreshToken(email: string): Promise<string>{
    const user: User = await this.userModel.findOne({ email })
    const payload = { email: user.email }
    return this.jwtService.sign(payload)
  }

  async validateUser(email: string, password: string): Promise<any>{
    const user: User = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, `User with this username not found`)
    }
    if (!user.isActivate) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, `Account not activated`)
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

  async logout(refresh_token: string): Promise<User>{
    const user = await this.userModel.findOne({ refresh_token })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NO_CONTENT)
    }
    user.refresh_token = null
    user.save()
    return user
  }

  async resetPasswordMail(email: string){
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, `User not found`)
    }
    await this.mailService.sendUserResetPassword(user)
  }

  async resetPassword(link: string): Promise<{ success: boolean }>{
    const user = await this.userModel.findOne({ link })
    if (!user) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, `User not found`)
    }
    user.password = null
    await user.save()
    return { success: true }
  }

  async newPassword(userReq: CreateUserDto){
    const { email, password } = userReq
    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new UnauthorizedException(HttpStatus.UNAUTHORIZED, `User with this username not found`)
    }
    user.password = await bcrypt.hash(password, 5)
    user.save()
    return { success: true }
  }

  async getAllUsers(): Promise<UserDto[]>{
    const users: User[] = await this.userModel.find()
    return users.map(item => new UserDto(item))
  }
}
