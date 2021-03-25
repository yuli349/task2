// Самый внимательный разработчик.
// Голосование за участника команды — выводит список участников команды постранично
// и позволяет проголосовать за участника в одной из номинаций.
import { VoteSlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import { commentReducer, userVoteMapper, userFilter } from '../helpers/helpers';

const SLIDE_ALIAS = 'vote';
const SLIDE_TITLE = 'Самый 🔎 внимательный разработчик';
const SLIDE_EMOJI = '🔎';

// Нужно найти все лайки к комментариям, полученные разработчиками за спринт, и просуммировать их количество.
export function prepareVoteSlide(store: Store, sprint: Sprint): VoteSlide {
    const comments = store.getSprintComments(sprint);
    const userLikeCommentsCount = Object.entries(comments.reduce(commentReducer, {}));
    userLikeCommentsCount.sort((a, b) => b[1] - a[1]);

    const users = userLikeCommentsCount.map(userVoteMapper.bind(null, store)).filter(userFilter);
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
