// Активность.
// Активность участников — визуализирует активность команды в виде тепловой карты по дням и часам.
import { ActivitySlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import { getDayOfWeek } from '../helpers/helpers';

const SLIDE_ALIAS = 'activity';
let SLIDE_TITLE = 'Коммиты';

interface DaysOfWeek {
    sun: number[];
    mon: number[];
    tue: number[];
    wed: number[];
    thu: number[];
    fri: number[];
    sat: number[];
}

// Нужно сгруппировать коммиты (для всех пользователей) в текущем спринте по дате и времени.
export function prepareActivitySlide(store: Store, sprint: Sprint): ActivitySlide {
    const commits = store.getSprintCommits(sprint);

    const result : DaysOfWeek = {
        mon: Array(24).fill(0),
        tue: Array(24).fill(0),
        wed: Array(24).fill(0),
        thu: Array(24).fill(0),
        fri: Array(24).fill(0),
        sat: Array(24).fill(0),
        sun: Array(24).fill(0),
    };
    Object.entries(commits).reduce((acc, [,commit]) => {
        const date = new Date(commit.timestamp);

        const dayOfWeekCommit = getDayOfWeek(date.getDay());
        const hourCommit = date.getHours();
        acc[dayOfWeekCommit][hourCommit]++;
        return acc;
    }, result);
    if (!commits.length) {
        SLIDE_TITLE = sprint.name;
    }
    return {
        alias: SLIDE_ALIAS,
        data: {
            title: SLIDE_TITLE,
            subtitle: sprint.name,
            data: result,
        },
    };
}
