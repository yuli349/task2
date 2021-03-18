import { Commit, Comment } from '../typings/input';
import { Store } from '../store';
import { User } from '../typings/output';

interface CommitReducerAcc { [userIdKey: string]: number }

export function declOfNum(number: number, words: [string, string, string]) {
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
}

export function commitReducer(acc: CommitReducerAcc, commit: Commit): CommitReducerAcc {
    const userId = typeof commit.author === 'number' ? commit.author : commit.author.id;

    if (!acc[userId]) {
        acc[userId] = 0;
    }

    acc[userId]++;

    return acc;
}

export function commentReducer(acc: CommitReducerAcc, comment: Comment): CommitReducerAcc {
    const userId = typeof comment.author === 'number' ? comment.author : comment.author.id;

    if (!acc[userId]) {
        acc[userId] = 0;
    }

    acc[userId] += Number(comment.likes.length);

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

export function userFilter(user: User | null): user is User {
    return Boolean(user);
}
