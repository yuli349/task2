import { Commit } from '../typings/input';
import { Store } from '../store';
import { User } from '../typings/output';

interface CommitReducerAcc { [userIdKey: string]: number }

export function commitReducer(acc: CommitReducerAcc, commit: Commit): CommitReducerAcc {
    const userId = typeof commit.author === 'number' ? commit.author : commit.author.id;

    if (!acc[userId]) {
        acc[userId] = 0;
    }

    acc[userId]++;

    return acc;
}

export function userMapper(store: Store, record: [string, number]): User | null {
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

export function userFilter(user: User | null): user is User {
    return Boolean(user);
}
