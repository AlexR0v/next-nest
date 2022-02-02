export class UserDto {
  email: string
  id: string
  isActivate: boolean

  constructor(model){
    this.email = model.email
    this.id = model._id
    this.isActivate = model.isActivate
  }
}
