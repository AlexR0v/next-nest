import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose                   from 'mongoose'
import { Document }                    from 'mongoose'
import { User }                        from '../../auth/models/user.model'
import { Track }                       from './track.schema'

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User

  @Prop()
  text: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Track' })
  trackId: Track
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
