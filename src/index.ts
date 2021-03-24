import { Entity } from './typings/input';
import { Slide } from './typings/output';
import { Store } from './store';
import { prepareLeadersSlide } from './slides/leaders';
import { prepareVoteSlide } from './slides/vote';
import { prepareChartSlide } from './slides/chart';
import { prepareDiagramSlide } from './slides/diagram';
import { prepareActivitySlide } from './slides/activity';

export function prepareData(entities: Entity[], options: { sprintId: number }): Slide[] {
    if (!Array.isArray(entities)) return [];
    if (!options || !options.sprintId) return [];

    const store = new Store(entities);
    const sprint = store.getSprint(options.sprintId);
    if (!sprint) {
        return [
            {
                alias: 'leaders',
                data: {
                    title: '',
                    subtitle: '',
                    emoji: '',
                    users: [],
                },
            },
            {
                alias: 'vote',
                data: {
                    title: '',
                    subtitle: '',
                    emoji: '',
                    users: [],
                },
            },
            {
                alias: 'chart',
                data: {
                    title: '',
                    subtitle: '',
                    values: [],
                    users: [],
                },
            },
            {
                alias: 'diagram',
                data: {
                    title: '',
                    subtitle: '',
                    totalText: '',
                    differenceText: '',
                    categories: [
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
                    ],
                },
            },
            {
                alias: 'activity',
                data: {
                    title: '',
                    subtitle: '',
                    data: {
                        sun: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        mon: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        tue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        wed: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        thu: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        fri: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        sat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    },
                },
            },
        ];
    }

    return [
        prepareLeadersSlide(store, sprint),
        prepareVoteSlide(store, sprint),
        prepareChartSlide(store, sprint),
        prepareDiagramSlide(store, sprint),
        prepareActivitySlide(store, sprint),
    ];
}
