// Лидеры по коммитам.
// Лидеры спринта — позволяет увидеть участников команды, лидирующих в разных номинациях.
// Также используется для отображения результатов голосования.

import { LeadersSlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import { getUsers } from '../helpers/helpers';

const SLIDE_ALIAS = 'leaders';
let SLIDE_TITLE = 'Больше всего коммитов';
let SLIDE_EMOJI = '👑';

// Нужно найти все коммиты из заданного спринта, сгруппировать их по пользователям.
export function prepareLeadersSlide(store: Store, sprint: Sprint): LeadersSlide {
    const commits = store.getSprintCommits(sprint);
    if (!commits.length) {
        SLIDE_EMOJI = '';
        SLIDE_TITLE = sprint.name;
    }
    return {
        alias: SLIDE_ALIAS,
        data: {
            title: SLIDE_TITLE,
            subtitle: sprint.name,
            emoji: SLIDE_EMOJI,
            users: getUsers(store, sprint),
        },
    };
}
