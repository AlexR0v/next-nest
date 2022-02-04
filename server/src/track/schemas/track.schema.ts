import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose                   from 'mongoose'
import { Document }                    from 'mongoose'
import { User }                        from '../../auth/models/user.model'
import { Comment }                     from './comment.schema'

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop()
  name: string

  @Prop()
  artist: string

  @Prop()
  text: string

  @Prop()
  listens: string

  @Prop()
  picture: string

  @Prop()
  audio: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[]
}

export const TrackSchema = SchemaFactory.createForClass(Track)
