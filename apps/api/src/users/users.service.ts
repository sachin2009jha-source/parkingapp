import { Injectable, ConflictException } from '@nestjs/common'
import { CreateUserInput } from './dto/create-user.input.js'
import { UpdateUserInput } from './dto/update-user.input.js'
import { RegisterCredentialsInput } from './dto/register-credentials.input.js'
import { PrismaService } from '../common/prisma/prisma.service.js'
import { randomUUID } from 'node:crypto'
import { hash } from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async registerWithCredentials(input: RegisterCredentialsInput) {
    const email = input.email.trim().toLowerCase()

    const existingCredentials =
      await this.prisma.db.orm.public.Credentials.where({ email }).first()

    if (existingCredentials) {
      throw new ConflictException('An account with this email already exists')
    }

    const uid = randomUUID()
    const passwordHash = await hash(input.password, 12)

    const user = await this.prisma.db.orm.public.User.create({
      uid,
      name: input.name ?? null,
      image: input.image ?? null,
      Credentials: (credentials) =>
        credentials.create({
          uid,
          email,
          passwordHash,
        }),
      AuthProvider: (provider) =>
        provider.create({
          uid,
          type: 'CREDENTIALS',
        }),
    })

    return {
      ...user,
      createdAt: new Date(String(user.createdAt)),
      updatedAt: new Date(String(user.updatedAt)),
    }
  }

  async create(createUserInput: CreateUserInput) {
    const user = await this.prisma.db.orm.public.User.create({
      uid: createUserInput.uid,
      name: createUserInput.name ?? null,
      image: createUserInput.image ?? null,
    })

    return {
      ...user,
      createdAt: new Date(String(user.createdAt)),
      updatedAt: new Date(String(user.updatedAt)),
    }
  }

  async findAll() {
    const users = await this.prisma.db.orm.public.User.all()
    return users.map((user) => ({
      ...user,
      createdAt: new Date(String(user.createdAt)),
      updatedAt: new Date(String(user.updatedAt)),
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
