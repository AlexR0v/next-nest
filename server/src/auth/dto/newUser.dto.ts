import { Comment } from '../../track/schemas/comment.schema'
import { Track }   from '../../track/schemas/track.schema'

export class UserDto {
  email: string
  username: string
  id: string
  isActivate: boolean
  comments: Comment[]
  tracks: Track[]

  constructor(model){
    this.email = model.email
    this.id = model._id
    this.isActivate = model.isActivate
    this.username = model.username
    this.comments = model.comments
    this.tracks = model.tracks
  }
}
