import { Injectable } from '@nestjs/common'
import { CreateUserInput } from './dto/create-user.input.js'
import { UpdateUserInput } from './dto/update-user.input.js'
import { PrismaService } from '../common/prisma/prisma.service.js'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput){
    const user = await this.prisma.db.orm.public.User.create({
      uid: createUserInput.uid,
      name: createUserInput.name ?? null,
      image: createUserInput.image ?? null,
    })

    return {
      ...user,
      createdAt: new Date(String(user.createdAt)),
      updatedAt: new Date(String(user.updatedAt))
    }
  }

  async findAll() {
    const users = await this.prisma.db.orm.public.User.all()
    return users.map((user) => ({
      ...user,
      createdAt: new Date(String(user.createdAt)),
      updatedAt: new Date(String(user.updatedAt))
    }))
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}