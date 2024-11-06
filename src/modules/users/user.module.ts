import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { TeamModule } from '../teams/team.module';
import { UserTeamsLoaderService } from './user-teams.loader';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User ]),
    forwardRef(() => TeamModule),
  ],
  providers: [ UserService, UserResolver, UserTeamsLoaderService ],
  exports: [ UserService ],
  controllers: [ UserController ],
})
export class UserModule {
}
