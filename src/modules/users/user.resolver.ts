import { Int, Args, Parent, Query, Mutation, Resolver, ResolveField, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import * as DataLoader from 'dataloader';
import { User, UserInput } from './user.model';
import { UserService } from './user.service';
import { TeamService } from '../teams/team.service';
import { UserTeamsLoaderService } from './user-teams.loader';
import { forwardRef, Inject } from '@nestjs/common';
import { Team } from '../teams/team.model';

let count = 0;
const pubSub = new PubSub();

@Resolver(of => User)
export class UserResolver {
  private userTeamsLoader: DataLoader<number, Team[]>;

  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,
    private readonly userTeamsService: UserTeamsLoaderService
  ) {
    this.userTeamsLoader = this.userTeamsService.createTeamsByUserLoader()
  }

  @Query(returns => [User], { name: 'users', nullable: false })
  async getUsers() {
    const users = await this.userService.findAll();

    // console.log(users);
    // console.log('call getUsers');

    return users
    // .concat([null]);
  }
  // , @Args({ name: 'test', type: () => String }) test: string
  @Query(returns => User, { name: 'user', nullable: true })
  async getUserById(@Args({ name: 'id', type: () => Int }) id: number) {
    console.log(id);
    return await this.userService.findById(id)
  }

  @Mutation(() => User, { name: 'createUser'})
  async createUser(@Args('data') input: UserInput): Promise<User> {
    console.log('input', input);
    
    const user = await this.userService.createUser(input);
    pubSub.publish('userAdded', { userAdded: user });

    return user;
  }

  @ResolveField('teams', () => [Team], {nullable: false})
  async getTeams(@Parent() user: User) {
    console.log('call getTeams', user.id);
    // Вместо выполнения нескольких отдельных запросов.
    // Он накапливает уникальные ключи и выполняет их
    // пакетом.
    // console.log('user', user);
    // console.log('count', ++count);

    

    return await this.userTeamsLoader.load(user.id);

    // return await user.teams;
  }

  @Subscription((returns) => User)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }
}

// // запрос
// [
//   {
//     id: 2
//   },
//   {
//     id: 1 // id - это уникальный ключ
//   }
// ] 

// // промежуточное представление, по сопоставление запроса и ответа.
// const usersKeys = {
//   1: user1,
//   2: user2
// }


// // ответ
// [
//   {
//     id: 1,
//     user: 'name 1'
//   },
//   {
//     id: 2,
//     user: 'name 2'
//   },
// ]


// Сложности graphQL
// - сложность запроса.
// - N + 1


// [String] - массив может быть null и элементы тоже могут быть null
// [String!] - массив может быть null и элементы НЕ МОГУТ быть null
// [String]! - массив НЕ МОЖЕТ быть null и элементы могут быть null
// [String!]! - массив НЕ МОЖЕТ быть null и элементы НЕ МОГУТ быть null


// 1. Реализовать перехватчик чтобы провалидировать запрос и аутентификацию
// user + role.
// 2. Юзера в context.user

// batching graphql

// Мы добавляем наш dataloader - это функция-обретка 
// Когда вызывается resolver - он не выполняет запрос, он накапливает все id-ики для запроса
// И когда все id-ники накоплены, он позволяет выполнить batch запроса

// import * as DataLoader from 'dataloader';
// import { Injectable, Scope } from '@nestjs/common';

// @Injectable({ scope: Scope.REQUEST })
// export class UserLoader {
//   private readonly userLoader = new DataLoader(async (userIds: readonly number[]) => {
//     const users = await this.userService.findByIds(userIds);
//     return userIds.map(id => users.find(user => user.id === id));
//   });

//   async load(userId: number) {
//     return this.userLoader.load(userId);
//   }
// }
