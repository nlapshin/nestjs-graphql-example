import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, Int, ObjectType, InputType, registerEnumType } from '@nestjs/graphql';
import { Team } from '../teams/team.model';

export enum EGenderType {
  Male = 1,
  Female = 2,
}

registerEnumType(EGenderType, {
  name: 'EGenderType',
});

export enum ERole {
  Admin = 'Admin',
  User = 'User'
}

registerEnumType(ERole, {
  name: 'ERole',
});

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field({ nullable: true })
  firstName: string;

  @Column()
  @Field({ nullable: false })
  lastName: string;

  @Column()
  @Field({ nullable: false })
  password: string;

  @ManyToMany(() => Team, team => team.members)
  @Field(type => [ Team ], { nullable: true })
  teams: Promise<Team[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => EGenderType, { nullable: true })
  gender: EGenderType;

  @Field(() => ERole, { nullable: true })
  role: ERole;
}

@InputType()
export class UserInput {
  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field({ nullable: false })
  password: string;

  @Field(() => Int, { nullable: true })
  teamId?: number;
}

// 1. Схемы, которые описывают контракты
// 2. Query - это специальный сущности, которые используются для получения данных.
// 3. Mutation - это специальный сущности, который используются для обновления

// type Team {
//   id: Int!
//   name: String!
//   members: [User!]
// }

// type User {
//   id: Int!
//   firstName: String!
//   lastName: String!
//   teams: [Team!]!
// }

// type Query {
//   users: [User!]!
//   user(id: Int!): User
//   teams: [Team!]
//   team(id: Int!): Team
// }

// type Mutation {
//   createUser(data: UserInput!): User!
//   createTeam(data: TeamInput!): Team!
//   addMember(userId: Int!, teamId: Int!): Team
//   removeMember(userId: Int!, teamId: Int!): Team
// }

// input UserInput {
//   firstName: String!
//   lastName: String!
//   teamId: Int
// }

// input TeamInput {
//   name: String!
// }
