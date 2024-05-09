import { IsNotEmpty } from "class-validator"
import { UserDto } from "./user.dto"

export class RegisterDto extends UserDto{
    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    passwordConfirmation: string
}