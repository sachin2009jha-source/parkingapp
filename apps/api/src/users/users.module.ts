import { Module } from '@nestjs/common'
import { UsersService } from './users.service.js'
import { UsersResolver } from './users.resolver.js'
import { UsersController } from './users.controllers.js'
import { PrismaModule } from '../common/prisma/prisma.module.js'
import { AuthModule } from "../common/auth/auth.module.js"

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
