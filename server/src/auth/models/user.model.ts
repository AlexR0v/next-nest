import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose                   from 'mongoose'
import { Document }                    from 'mongoose'
import { Comment }                     from '../../track/schemas/comment.schema'
import { Track }                       from '../../track/schemas/track.schema'

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

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  tracks: Track[]

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[]
}

export const UserModel = SchemaFactory.createForClass(User)
