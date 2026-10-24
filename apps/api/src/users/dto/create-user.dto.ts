import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    uid!: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    image?: string
}
