import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as DataLoader from 'dataloader';
import { Team } from '../teams/team.model';
import { User } from './user.model';

@Injectable()
export class UserTeamsLoaderService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Создаем DataLoader для загрузки участников команд
  public createTeamsByUserLoader(): DataLoader<number, Team[]> {
    return new DataLoader<number, Team[]>(async (userIds: number[]) => {
      const teams: Team[][] = [];

      const users = await this.userRepository.find({
        where: { id: In(userIds) },
        relations: [ 'teams' ],
      });

      for (const userId of userIds) {
        const user = users.find(item => item.id === userId);

        teams.push(await user.teams);
      }

      return teams;
    });
  }
}
