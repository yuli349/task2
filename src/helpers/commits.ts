import { Comment, Commit } from '../typings/input';
import { Store } from '../store';

interface CommitReducerAcc { [userIdKey: string]: number }

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
