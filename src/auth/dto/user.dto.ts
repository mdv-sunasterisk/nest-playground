import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class UserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    mobileNumber: string
}