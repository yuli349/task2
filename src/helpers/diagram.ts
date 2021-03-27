import { declOfNum } from './common';
import { getCommitSize, getCommitSizeInterval } from './commits';
import { Store } from '../store';

interface CommitsArray { [key: number]: {} }
interface ResultArray { [key: number]: number }

export function numberOfCommits(number: number) {
    return `${number} ${declOfNum(Math.abs(number), ['коммит', 'коммита', 'коммитов'])}`;
}

export function numberDifferentText(number: number) {
    if (number < 0) {
        return `-${-number}`;
    } if (number === 0) {
        return number;
    }
    return `+${number}`;
}

export function initializeCategories() {
    return [
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
}

export function getCommitSizeCategories(store: Store, commits: CommitsArray): ResultArray {
    const result : ResultArray = [0, 0, 0, 0];
    Object.entries(commits).reduce((acc, [,commit]) => {
        const commitSize = getCommitSize(store, commit);
        const resultPosition = getCommitSizeInterval(commitSize);
        acc[resultPosition]++;
        return acc;
    }, result);

    return result;
}
