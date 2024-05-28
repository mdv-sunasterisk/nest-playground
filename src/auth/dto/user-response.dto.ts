import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserResponseDto {
    @ApiProperty({ type: Number })
    @Expose()
    id: number;

    @ApiProperty({ type: String })
    @Expose()
    firstName: string;

    @ApiProperty({ type: String })
    @Expose()
    lastName: string;

    @ApiProperty({ type: String })
    @Expose()
    email: string;

    @ApiProperty({ type: String })
    @Expose()
    mobileNumber: string;

    @ApiProperty({ type: Date })
    @Expose()
    createdAt: Date;
    
    @ApiProperty({ type: String })
    @Expose()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
    
    constructor(user: Partial<UserResponseDto>) {
        Object.assign(this, user);
    }
}