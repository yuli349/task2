// Размер коммитов.
// Статистика внутри спринта — визуализирует статистику внутри спринта по качественным характеристикам,
// например размеру коммитов в спринте, и разницу с предыдущим спринтом.
import { DiagramSlide } from '../typings/output';
import { Sprint } from '../typings/input';
import { Store } from '../store';
import { declOfNum } from '../helpers/common';
import {
    numberOfCommits, numberDifferentText, initializeCategories, getCommitSizeCategories,
} from '../helpers/diagram';

const SLIDE_ALIAS = 'diagram';
const SLIDE_TITLE = 'Размер коммитов';

// Вам нужно найти все коммиты в текущем спринте и сгруппировать из по размеру (см. макет).
// После этого сделайте всё то же самое для предыдущего спринта и посчитайте разницу между ними
// (как по группам, так и общую - см. макет).
//
// Размер коммита — это сумма количества добавленных и удаленных строк.
// Например, если добавлено 5 строк и удалено 5 строк, то размер коммита будет равен 10.
export function prepareDiagramSlide(store: Store, sprint: Sprint): DiagramSlide {
    const categories = initializeCategories();
    const commits = store.getSprintCommits(sprint);
    const sortedSprintIds = store.getSortedSprintIds();

    const prevSprintId = store.getPreviousSprintId(sprint);
    const prevSprint = store.getSprint(prevSprintId)!;
    const prevCommits = store.getSprintCommits(prevSprint);

    const totalText = `${commits.length ? numberOfCommits(commits.length) : '0 коммитов'}`;
    const sizeCommitsCategories = getCommitSizeCategories(store, commits);

    let differenceText;
    let sizePrevCommitsCategories;

    if (prevSprintId === sortedSprintIds[0]) {
        differenceText = `${numberDifferentText(commits.length)} с прошлого спринта`;
        sizePrevCommitsCategories = [0, 0, 0, 0];
    } else {
        differenceText = `${numberDifferentText(commits.length - prevCommits.length)} с прошлого спринта`;
        sizePrevCommitsCategories = getCommitSizeCategories(store, prevCommits);
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
