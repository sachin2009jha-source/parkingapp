import { Controller, Get, Query } from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { UsersService } from "./users.service.js"
import { QueryUsersDto } from "./dto/query-users.dto.js"
import { UserRestEntity } from "./entities/user-rest.entity.js"

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}

    @Get()
    @ApiOkResponse({ type: [UserRestEntity] })
    async findAll(@Query() query: QueryUsersDto) {
        const users = await this.usersService.findAll()
        const start = query.skip ?? 0
        const end = start + (query.take ?? 20)

        return users.slice(start, end)
    }
}