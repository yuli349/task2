// Размер коммитов.
// Статистика внутри спринта — визуализирует статистику внутри спринта по качественным характеристикам,
// например размеру коммитов в спринте, и разницу с предыдущим спринтом.
import { DiagramSlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import {
    numberOfCommits, getCommitSizeCategories, numberDifferentText, declOfNum,
} from '../helpers/helpers';

const SLIDE_ALIAS = 'diagram';
const SLIDE_TITLE = 'Размер коммитов';

// Вам нужно найти все коммиты в текущем спринте и сгруппировать из по размеру (см. макет).
// После этого сделайте всё то же самое для предыдущего спринта и посчитайте разницу между ними
// (как по группам, так и общую - см. макет).
//
// Размер коммита — это сумма количества добавленных и удаленных строк.
// Например, если добавлено 5 строк и удалено 5 строк, то размер коммита будет равен 10.
export function prepareDiagramSlide(store: Store, sprint: Sprint): DiagramSlide {
    let differenceText;
    const categories = [
        {
            title: '> 1001 строки',
            valueText: '0 коммитов',
            differenceText: '0 коммитов',
        },
        {
            title: '501 — 1000 строк',
            valueText: '0 коммитов',
            differenceText: '0 коммитов',
        },
        {
            title: '101 — 500 строк',
            valueText: '0 коммитов',
            differenceText: '0 коммитов',
        },
        {
            title: '1 — 100 строк',
            valueText: '0 коммитов',
            differenceText: '0 коммитов',
        },
    ];
    const commits = store.getSprintCommits(sprint);
    const { sprintIds } = store;
    sprintIds.sort((a, b) => a - b);
    const prevSprintId = sprintIds[sprintIds.indexOf(sprint.id) - 1] ?? sprint.id;
    const prevSprint = store.getSprint(prevSprintId)!;
    const prevCommits = store.getSprintCommits(prevSprint);
    let totalText = `${commits.length ? numberOfCommits(commits.length) : '0 коммитов'}`;
    differenceText = `${numberDifferentText(commits.length - prevCommits.length)} с прошлого спринта`;
    const sizeCommitsCategories = getCommitSizeCategories(store, commits);
    let sizePrevCommitsCategories = getCommitSizeCategories(store, prevCommits);
    if (prevSprintId === sprintIds[0]) {
        differenceText = `${numberDifferentText(commits.length)} с прошлого спринта`;
        sizePrevCommitsCategories = [0, 0, 0, 0];
    }
    if (!commits.length && !prevCommits.length) {
        differenceText = '';
        totalText = '';
    }
    for (let i = 0; i < categories.length; ++i) {
        const diffCount = sizeCommitsCategories[i] - sizePrevCommitsCategories[i];
        Object.assign(categories[i], {
            valueText: `${numberOfCommits(sizeCommitsCategories[i])}`,
            differenceText:
                `${numberDifferentText(diffCount)} ${declOfNum(Math.abs(diffCount),
                    ['коммит', 'коммита', 'коммитов'])}`,
        });
    }
    return {
        alias: SLIDE_ALIAS,
        data: {
            title: SLIDE_TITLE,
            subtitle: sprint.name,
            totalText,
            differenceText,
            categories,
        },
    };
}
