import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/users/user.module';
import { TeamModule } from './modules/teams/team.module';
import { GraphQLModule } from '@nestjs/graphql';
import { Team } from './modules/teams/team.model';
import { User } from './modules/users/user.model';

@Module({
  imports: [
    // Работа с БД
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '0.0.0.0',
      port: 15432,
      username: 'test-user',
      password: 'test-password',
      database: 'demo',
      entities: [ Team, User ],
      synchronize: true,
    }),
    // Работа с GRAPHQL
    GraphQLModule.forRoot({ 
      autoSchemaFile: 'schema.gql',
      // включить
      installSubscriptionHandlers: true, 
    }),

    UserModule,
    TeamModule,
  ],
})
export class AppModule {
}
