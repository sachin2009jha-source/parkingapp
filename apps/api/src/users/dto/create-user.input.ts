import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CreateUserInput {
  @Field(() => ID)
  uid!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  image?: string
}
