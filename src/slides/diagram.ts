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
    const commits = store.getSprintCommits(sprint);
    const exsSprint = store.getSprint(sprint.id - 1)!;
    const exsCommits = store.getSprintCommits(exsSprint);
    const totalText = `${numberOfCommits(commits.length)}`;
    const differenceText = `${commits.length - exsCommits.length} с прошлого спринта`;
    const sizeCommitsCategories = getCommitSizeCategories(store, commits);
    const sizeExsCommitsCategories = getCommitSizeCategories(store, exsCommits);
    const categories = [
        {
            title: '> 1001 строки',
            valueText: `${numberOfCommits(sizeCommitsCategories[0])}`,
            differenceText: `${numberOfCommits(sizeCommitsCategories[0] - sizeExsCommitsCategories[0])}`,
        },
        {
            title: '501 — 1000 строк',
            valueText: `${numberOfCommits(sizeCommitsCategories[1])}`,
            differenceText: `${numberOfCommits(sizeCommitsCategories[1] - sizeExsCommitsCategories[1])}`,
        },
        {
            title: '101 — 500 строк',
            valueText: `${numberOfCommits(sizeCommitsCategories[2])}`,
            differenceText: `${numberOfCommits(sizeCommitsCategories[2] - sizeExsCommitsCategories[2])}`,
        },
        {
            title: '1 — 100 строк',
            valueText: `${numberOfCommits(sizeCommitsCategories[3])}`,
            differenceText: `${numberOfCommits(sizeCommitsCategories[3] - sizeExsCommitsCategories[3])}`,
        },
    ];
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
