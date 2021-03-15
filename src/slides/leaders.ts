// Лидеры по коммитам.
// Лидеры спринта — позволяет увидеть участников команды, лидирующих в разных номинациях.
// Также используется для отображения результатов голосования.

import { LeadersSlide, User } from '../typings/output';
import { Commit, Sprint } from '../typings/input';
import { Store } from '../store';

const SLIDE_ALIAS = 'leaders';
const SLIDE_TITLE = 'Больше всего коммитов';
const SLIDE_EMOJI = '👑';

interface CommitReducerAcc { [userIdKey: string]: number }

function commitReducer(acc: CommitReducerAcc, commit: Commit): CommitReducerAcc {
    const userId = typeof commit.author === 'number' ? commit.author : commit.author.id;

    if (!acc[userId]) {
        acc[userId] = 0;
    }

    acc[userId]++;

    return acc;
}

function userMapper(store: Store, record: [string, number]): User | null {
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

function userFilter(user: User | null): user is User {
    return Boolean(user);
}

// Нужно найти все коммиты из заданного спринта, сгруппировать их по пользователям.
export function prepareLeadersSlide(store: Store, sprint: Sprint): LeadersSlide | null {
    const commits = store.getSprintCommits(sprint);

    const userCommitsCount = Object.entries(commits.reduce(commitReducer, {}));
    userCommitsCount.sort((a, b) => b[1] - a[1]);

    const users = userCommitsCount.map(userMapper.bind(null, store)).filter(userFilter);

    return {
        alias: SLIDE_ALIAS,
        data: {
            title: SLIDE_TITLE,
            subtitle: sprint.name,
            emoji: SLIDE_EMOJI,
            users,
        },
    };
}
