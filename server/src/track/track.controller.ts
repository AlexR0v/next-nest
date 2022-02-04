import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors
}                                from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { Request }               from 'express'
import { ObjectId }              from 'mongoose'
import { JwtAuthGuard }          from '../auth/guards/jwt.guard'
import { User }                  from '../auth/models/user.model'
import { CreateCommentDto }      from './dto/create-comment.dto'
import { CreateTrackDto }        from './dto/create-track.dto'
import { Comment }               from './schemas/comment.schema'
import { Track }                 from './schemas/track.schema'
import { TrackService }          from './track.service'

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService){}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'picture', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]))
  createTrack(
    @Req() req: Request,
    @UploadedFiles() files: { picture?: Express.Multer.File[], audio?: Express.Multer.File[] },
    @Body() track: CreateTrackDto): Promise<Track>{
    const { picture, audio } = files
    const { email } = req.user as User
    return this.trackService.create(track, picture[0], audio[0], email)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllTracks(@Query('count') count: number, @Query('offset') offset: number){
    return this.trackService.getAll(count, offset)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOneTrack(@Param('id') id: ObjectId){
    return this.trackService.getOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search')
  search(@Query('query') query: string){
    return this.trackService.search(query)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTrack(@Param('id') id: ObjectId){
    return this.trackService.delete(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/comment')
  addComment(@Req() req: Request, @Body() dto: CreateCommentDto): Promise<Comment>{
    const { email } = req.user as User
    return this.trackService.addComment(dto, email)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId){
    return this.trackService.listen(id)
  }
}
