// Активность.
// Активность участников — визуализирует активность команды в виде тепловой карты по дням и часам.
import { ActivitySlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import { initializeCommitsByDayOfWeek, getDayOfWeek } from '../helpers/activity';

const SLIDE_ALIAS = 'activity';
const SLIDE_TITLE = 'Коммиты';

// Нужно сгруппировать коммиты (для всех пользователей) в текущем спринте по дате и времени.
export function prepareActivitySlide(store: Store, sprint: Sprint): ActivitySlide {
    const commits = store.getSprintCommits(sprint);
    const commitsByDayOfWeek = initializeCommitsByDayOfWeek();

    Object.entries(commits).reduce((acc, [,commit]) => {
        const commitDate = new Date(commit.timestamp);

        const dayOfWeekOfCommit = getDayOfWeek(commitDate.getDay());
        const hourOfCommit = commitDate.getHours();
        acc[dayOfWeekOfCommit][hourOfCommit]++;

        return acc;
    }, commitsByDayOfWeek);

    return {
        alias: SLIDE_ALIAS,
        data: {
            title: SLIDE_TITLE,
            subtitle: sprint.name,
            data: commitsByDayOfWeek,
        },
    };
}
