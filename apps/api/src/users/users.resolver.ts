import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UsersService } from './users.service.js'
import { User } from './entities/user.entity.js'
import { CreateUserInput } from './dto/create-user.input.js'
import { UpdateUserInput } from './dto/update-user.input.js'
import { RegisterCredentialsInput } from './dto/register-credentials.input.js'
import { LoginCredentialsInput } from './dto/login-credentials.input.js'
import { LoginResponse } from './entities/login-response.entity.js'
import { UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../common/auth/jwt-auth.guard.js"

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  registerWithCredentials(@Args('input') input: RegisterCredentialsInput) {
    return this.usersService.registerWithCredentials(input)
  }

  @Mutation(() => LoginResponse)
  loginWithCredentials(@Args('input') input: LoginCredentialsInput) {
    return this.usersService.loginWithCredentials(input)
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput)
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll()
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id)
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput)
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id)
  }
}
