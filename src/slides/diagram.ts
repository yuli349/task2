// Размер коммитов.
// Статистика внутри спринта — визуализирует статистику внутри спринта по качественным характеристикам,
// например размеру коммитов в спринте, и разницу с предыдущим спринтом.
import { DiagramSlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import { numberOfCommits, getCommitSizeCategories } from '../helpers/helpers';

const SLIDE_ALIAS = 'diagram';
const SLIDE_TITLE = 'Размер коммитов';

// Вам нужно найти все коммиты в текущем спринте и сгруппировать из по размеру (см. макет).
// После этого сделайте всё то же самое для предыдущего спринта и посчитайте разницу между ними
// (как по группам, так и общую - см. макет).
//
// Размер коммита — это сумма количества добавленных и удаленных строк.
// Например, если добавлено 5 строк и удалено 5 строк, то размер коммита будет равен 10.
export function prepareDiagramSlide(store: Store, sprint: Sprint): DiagramSlide {
    let diagramDifferenceText = '0 с прошлого спринта';

    let diagramCategories = [
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
    sprintIds.sort();
    const prevSprintId = sprintIds[sprintIds.indexOf(sprint.id) - 1] ?? sprint.id;
    const prevSprint = store.getSprint(prevSprintId)!;
    const prevCommits = store.getSprintCommits(prevSprint);
    const totalText = `${numberOfCommits(commits.length)}`;
    if (commits && prevCommits) {
        diagramDifferenceText = `${commits.length - prevCommits.length} с прошлого спринта`;

        const sizeCommitsCategories = getCommitSizeCategories(store, commits);
        const sizePrevCommitsCategories = getCommitSizeCategories(store, prevCommits);
        diagramCategories = [
            {
                title: '> 1001 строки',
                valueText: `${numberOfCommits(sizeCommitsCategories[0])}`,
                differenceText: `${numberOfCommits(sizeCommitsCategories[0] - sizePrevCommitsCategories[0])}`,
            },
            {
                title: '501 — 1000 строк',
                valueText: `${numberOfCommits(sizeCommitsCategories[1])}`,
                differenceText: `${numberOfCommits(sizeCommitsCategories[1] - sizePrevCommitsCategories[1])}`,
            },
            {
                title: '101 — 500 строк',
                valueText: `${numberOfCommits(sizeCommitsCategories[2])}`,
                differenceText: `${numberOfCommits(sizeCommitsCategories[2] - sizePrevCommitsCategories[2])}`,
            },
            {
                title: '1 — 100 строк',
                valueText: `${numberOfCommits(sizeCommitsCategories[3])}`,
                differenceText: `${numberOfCommits(sizeCommitsCategories[3] - sizePrevCommitsCategories[3])}`,
            },
        ];
    }
    return {
        alias: SLIDE_ALIAS,
        data: {
            title: SLIDE_TITLE,
            subtitle: sprint.name,
            totalText,
            differenceText: diagramDifferenceText,
            categories: diagramCategories,
        },
    };
}
