// Коммиты.
// Статистика по спринтам — визуализирует статистику текущего спринта по сравнению с предыдущими спринтами,
// например показывает количество коммитов в текущем и предыдущих спринтах.
import { ChartSlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import { commitReducer, userCommitsMapper, userFilter } from '../helpers/helpers';

const SLIDE_ALIAS = 'chart';
const SLIDE_TITLE = 'Коммиты';

// В верхней части слайда отображается диаграмма, которая показывает количество коммитов в каждом спринте.
// В нижней части находится список пользователей с наибольшим числом коммитов в текущем спринте.
export function prepareChartSlide(store: Store, sprint: Sprint): ChartSlide {
    const commits = store.getSprintCommits(sprint);

    const userCommitsCount = Object.entries(commits.reduce(commitReducer, {}));
    userCommitsCount.sort((a, b) => b[1] - a[1]);

    const values = Object.entries(store.sprints).map(([, sprintItem]) => ({
        title: sprintItem.id.toString(),
        hint: sprintItem.name,
        value: store.getSprintCommits(sprintItem).length,
        active: sprintItem.id === sprint.id || undefined,
    }));

    const users = userCommitsCount.map(userCommitsMapper.bind(null, store)).filter(userFilter);

    return {
        alias: SLIDE_ALIAS,
        data: {
            title: SLIDE_TITLE,
            subtitle: sprint.name,
            values,
            users,
        },
    };
}
