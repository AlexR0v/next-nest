import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document }                    from 'mongoose'

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  email: string

  @Prop({ unique: true })
  username: string

  @Prop()
  password: string

  @Prop()
  refresh_token: string

  @Prop()
  isActivate: boolean

  @Prop()
  link: string
}

export const UserModel = SchemaFactory.createForClass(User)
