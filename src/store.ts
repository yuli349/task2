import {
    Commit,
    Comment,
    Entity,
    Issue,
    Project,
    Sprint,
    SprintId,
    Summary,
    User, UserId,
} from './typings/input';

export class Store {
    sprints: { [key: number]: Sprint } = {};
    commits: Commit[] = [];
    users: { [key: number]: User } = {};
    comments: Comment[] = [];
    issues: Issue[] = [];
    summaries: Summary[] = [];
    projects: Project[] = [];

    commitsBySprint: { [key: number]: Commit[] } = {};

    constructor(entities: Entity[]) {
        // Проходим один раз по всем записям, раскладывая их по типам
        entities.forEach((entity) => {
            switch (entity.type) {
                case 'Sprint':
                    this.sprints[entity.id] = entity;
                    break;

                case 'Commit':
                    this.commits.push(entity);
                    break;

                case 'User':
                    this.users[entity.id] = entity;
                    break;

                case 'Comment':
                    this.comments.push(entity);
                    break;

                case 'Issue':
                    this.issues.push(entity);
                    break;

                case 'Summary':
                    this.summaries.push(entity);
                    break;

                case 'Project':
                    this.projects.push(entity);
                    break;

                default:
                    // @ts-ignore
                    // eslint-disable-next-line no-console
                    console.warn(`Неизвестный тип во входных данных: ${entity.type}`);
            }
        });
    }

    getSprint(sprintId: SprintId): Sprint | null {
        return this.sprints[sprintId] || null;
    }

    getUser(userId: UserId): User | null {
        return this.users[userId] || null;
    }

    getSprintCommits(sprint: Sprint): Commit[] {
        if (this.commitsBySprint[sprint.id] === undefined) {
            this.commitsBySprint[sprint.id] = this.commits.filter((commit) => (
                commit.timestamp >= sprint.startAt && commit.timestamp <= sprint.finishAt));
        }

        return this.commitsBySprint[sprint.id];
    }
}
