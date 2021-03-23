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
    if (!options) return [];

    const store = new Store(entities);
    const sprint = store.getSprint(options.sprintId);
    if (!sprint) {
        return [
            {
                alias: 'leaders',
                data: {
                    emoji: '',
                    subtitle: '',
                    title: '',
                    users: [],
                },
            },
            {
                alias: 'vote',
                data: {
                    emoji: '',
                    subtitle: '',
                    title: '',
                    users: [],
                },
            },
            {
                alias: 'chart',
                data: {
                    subtitle: '',
                    title: '',
                    users: [],
                    values: [],
                },
            },
            {
                alias: 'diagram',
                data: {
                    title: '',
                    subtitle: '',
                    totalText: '',
                    differenceText: '',
                    categories: [],
                },
            },
            {
                alias: 'activity',
                data: {
                    title: '',
                    subtitle: '',
                    data: {
                        sun: [],
                        mon: [],
                        tue: [],
                        wed: [],
                        thu: [],
                        fri: [],
                        sat: [],
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
