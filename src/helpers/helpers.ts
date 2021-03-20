import { Commit, Comment } from '../typings/input';
import { Store } from '../store';
import { User } from '../typings/output';

interface CommitReducerAcc { [userIdKey: string]: number }

export function declOfNum(number: number, words: [string, string, string]) {
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
}

export function numberOfCommits(number: number) {
    if (number < 0) {
        return `-${-number} ${declOfNum(-number, ['коммит', 'коммита', 'коммитов'])}`;
    }
    return `${number} ${declOfNum(number, ['коммит', 'коммита', 'коммитов'])}`;
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

export function getDayNameByDayNumber(dayNumber: number): string {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[dayNumber];
}

export function getCommitSize(store: Store, commit: Commit): number {
    const summariesByCommit = store.getCommitSummaries(commit);
    let size = 0;
    summariesByCommit.reduce((acc, summary) => {
        size = size + summary.added + summary.removed;
        return acc;
    }, size);
    return size;
}

export function getCommitSizeInterval(size: number): number {
    switch (true) {
        case size > 0 && size < 101:
            return 3;
        case size >= 101 && size < 501:
            return 2;
        case size >= 501 && size < 1001:
            return 1;
        default:
            return 0;
    }
}

interface CommitsArray { [key: number]: {} }
interface ResultArray { [key: number]: number }

export function getCommitSizeCategories(store: Store, commits: CommitsArray): ResultArray {
    const result : ResultArray = [0, 0, 0, 0];
    Object.entries(commits).reduce((acc, [,commit]) => {
        const commitSize = getCommitSize(store, commit);
        const resultPosition = getCommitSizeInterval(commitSize);
        acc[resultPosition]++;
        return acc;
    }, result);

    return result;
}
