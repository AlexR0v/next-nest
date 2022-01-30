export class UserDto {
  username: string
  id: string
  access_token?: string

  constructor(model, token = ''){
    this.username = model.username
    this.id = model._id
    this.access_token = token
  }
}
