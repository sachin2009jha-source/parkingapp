import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsIn, IsInt, IsOptional, IsPort, IsString, Min } from "class-validator"
import { Type } from "class-transformer"

export class QueryUsersDto {
    @ApiPropertyOptional({ minimum: 0, default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    skip?: number = 0

    @ApiPropertyOptional({ minimum: 1, default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    take?: number = 20

    @ApiPropertyOptional({ enum: ['uid', 'name', 'createdAt', 'updatedAt'] })
    @IsOptional()
    @IsIn(['uid', 'name', 'createdAt', 'updatedAt'])
    sortBy?: string

    @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'asc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc'
}