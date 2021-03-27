// Лидеры по коммитам.
// Лидеры спринта — позволяет увидеть участников команды, лидирующих в разных номинациях.
// Также используется для отображения результатов голосования.

import { LeadersSlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import { getUsers } from '../helpers/users';

const SLIDE_ALIAS = 'leaders';
const SLIDE_TITLE = 'Больше всего коммитов';
const SLIDE_EMOJI = '👑';

// Нужно найти все коммиты из заданного спринта, сгруппировать их по пользователям.
export function prepareLeadersSlide(store: Store, sprint: Sprint): LeadersSlide {
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
