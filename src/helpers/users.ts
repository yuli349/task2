import { Store } from '../store';
import { Sprint } from '../typings/input';
import { declOfNum } from './common';
import { User } from '../typings/output';
import { commitReducer } from './commits';

export function userFilter(user: User | null): user is User {
    return Boolean(user);
}

export function userCommitsMapper(store: Store, record: [string, number]): User | null {
    const [userId, commitsCount] = record;
    const user = store.getUser(Number(userId));

    if (!user) return null;

    return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        valueText: String(commitsCount),
    };
}

export function getUsers(store: Store, sprint: Sprint) {
    const commits = store.getSprintCommits(sprint);

    const userCommitsCount = Object.entries(commits.reduce(commitReducer, {}));
    userCommitsCount.sort((a, b) => b[1] - a[1]);

    return userCommitsCount.map(userCommitsMapper.bind(null, store)).filter(userFilter);
}

export function userVoteMapper(store: Store, record: [string, number]): User | null {
    const [userId, commentsCount] = record;
    const user = store.getUser(Number(userId));

    if (!user) return null;

    return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        valueText: `${commentsCount} ${declOfNum(commentsCount, ['голос', 'голоса', 'голосов'])}`,
    };
}
