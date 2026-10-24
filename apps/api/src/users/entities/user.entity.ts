import { Field, ID, ObjectType, GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType()
export class User {
  @Field(() => ID)
  uid!: string

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date

  @Field({ nullable: true })
  name?: string | null

  @Field({ nullable: true })
  image?: string | null
}