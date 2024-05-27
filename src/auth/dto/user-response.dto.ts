import { PickType } from "@nestjs/swagger";
import { User } from "src/_gen/prisma-class/user";

export class UserResponseDto extends PickType(User, ['id', 'firstName', 'lastName', 'email', 'mobileNumber', 'createdAt']) {}