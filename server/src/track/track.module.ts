import { Module }                 from '@nestjs/common'
import { MongooseModule }         from '@nestjs/mongoose'
import { JwtAuthGuard }           from '../auth/guards/jwt.guard'
import { User, UserModel }        from '../auth/models/user.model'
import { FileService }            from '../file/file.service'
import { Comment, CommentSchema } from './schemas/comment.schema'
import { Track, TrackSchema }     from './schemas/track.schema'
import { TrackController }        from './track.controller'
import { TrackService }           from './track.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserModel }])
  ],
  controllers: [TrackController],
  providers: [TrackService, FileService, JwtAuthGuard]
})
export class TrackModule {}
