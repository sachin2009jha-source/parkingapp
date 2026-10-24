import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class UserRestEntity {
    @ApiProperty()
    uid!: string

    @ApiProperty()
    createdAt!: Date

    @ApiProperty()
    updatedAt!: Date

    @ApiPropertyOptional({ type: String, nullable: true })
    name!: string | null

    @ApiPropertyOptional({ type: String, nullable: true })
    image!: string | null
}