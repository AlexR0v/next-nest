import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as fs                                   from 'fs'
import * as path                                 from 'path'
import * as uuid                                 from 'uuid'

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image'
}

@Injectable()
export class FileService {

  createFile(type: FileType, file): string{
    try {
      const fileExtension = file.originalname.split('.').pop()
      const fileName = uuid.v4() + '.' + fileExtension
      const filePath = path.resolve(__dirname, '..', 'static', type)
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true })
      }
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer)
      return type + '/' + fileName
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeFile(file: string){
    try {
      const fileName = file.split('/')[1]
      const fileType = file.split('/')[0]
      const filePath = path.resolve(__dirname, '..', 'static', fileType)
      if (fs.existsSync(filePath + '/' + fileName)) {
        await fs.promises.unlink(filePath + '/' + fileName)
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
