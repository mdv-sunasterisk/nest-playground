import { IsNotEmpty, IsString } from "class-validator"
import { UserDto } from "./user.dto"

export class RegisterDto extends UserDto{
    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    passwordConfirmation: string
}