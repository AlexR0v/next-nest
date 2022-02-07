import { Injectable }               from '@nestjs/common'
import { InjectModel }              from '@nestjs/mongoose'
import { Model, ObjectId }          from 'mongoose'
import { User, UserDocument }       from '../auth/models/user.model'
import { FileService, FileType }    from '../file/file.service'
import { CreateCommentDto }         from './dto/create-comment.dto'
import { CreateTrackDto }           from './dto/create-track.dto'
import { Comment, CommentDocument } from './schemas/comment.schema'
import { Track, TrackDocument }     from './schemas/track.schema'

@Injectable()
export class TrackService {

  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileService: FileService
  ){}

  async create(track: CreateTrackDto, picture, audio, email): Promise<Track>{
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio)
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture)
    const user = await this.userModel.findOne({ email })
    const newTrack = await this.trackModel.create(
      { ...track, userId: user._id, listens: 0, audio: audioPath, picture: picturePath })
    user.tracks.push(newTrack._id)
    await user.save()
    return newTrack
  }

  async getAll(count = 10, offset = 0): Promise<Track[]>{
    return this.trackModel.find().skip(Number(offset)).limit(Number(count))
  }

  async getOne(id: ObjectId): Promise<Track>{
    return this.trackModel.findById(id).populate({
      path: 'comments',
      populate: {
        path: 'userId'
      }
    })
  }

  async delete(id: ObjectId){
    const track = await this.trackModel.findById(id)
    const audio = track.audio
    const picture = track.picture
    if (audio) {
      await this.fileService.removeFile(audio)
    }
    if (picture) {
      await this.fileService.removeFile(picture)
    }
    await this.trackModel.findOneAndDelete(id)
    return { message: 'Трек удален!' }
  }

  async addComment(dto: CreateCommentDto, email): Promise<Comment>{
    const user = await this.userModel.findOne({ email })
    const track = await this.trackModel.findById(dto.trackId)
    const comment = await this.commentModel.create({ ...dto, userId: user._id })
    user.comments.push(comment._id)
    track.comments.push(comment._id)
    await comment.save()
    await track.save()
    await user.save()
    return comment
  }

  async listen(id: ObjectId){
    const track = await this.trackModel.findById(id)
    track.listens += 1
    track.save()
  }

  async search(query: string): Promise<Track[]>{
    return this.trackModel.find({
      name: { $regex: new RegExp(query, 'i') }
    })
  }
}
