import { MailerService } from '@nestjs-modules/mailer'
import { Injectable }    from '@nestjs/common'
import { User }          from '../auth/models/user.model'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService){}

  async sendUserConfirmation(user: User){
    const url = `${process.env.API_URL}/api/auth/activate/${user.link}`

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Активация аккаунта, подтвердите свой email',
      template: '/confirmation.hbs',
      context: {
        url
      }
    })
  }

  async sendUserResetPassword(user: User){
    const url = `${process.env.API_URL}/api/auth/reset-password/${user.link}`

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Сброс пароля',
      template: '/resetPassword.hbs',
      context: {
        url
      }
    })
  }
}
