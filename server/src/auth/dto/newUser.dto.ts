export class UserDto {
  username: string
  id: string
  isActivate: boolean

  constructor(model){
    this.username = model.username
    this.id = model._id
    this.isActivate = model.isActivate
  }
}
