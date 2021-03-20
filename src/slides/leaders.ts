// Лидеры по коммитам.
// Лидеры спринта — позволяет увидеть участников команды, лидирующих в разных номинациях.
// Также используется для отображения результатов голосования.

import { LeadersSlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import { commitReducer, userMapper, userFilter } from '../helpers/helpers';

const SLIDE_ALIAS = 'leaders';
const SLIDE_TITLE = 'Больше всего коммитов';
const SLIDE_EMOJI = '👑';

// Нужно найти все коммиты из заданного спринта, сгруппировать их по пользователям.
export function prepareLeadersSlide(store: Store, sprint: Sprint): LeadersSlide {
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
