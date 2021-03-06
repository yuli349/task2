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
    if (!sprint) return [];

    return [
        prepareLeadersSlide(store, sprint),
        prepareVoteSlide(store, sprint),
        prepareChartSlide(store, sprint),
        prepareDiagramSlide(store, sprint),
        prepareActivitySlide(store, sprint),
    ];
}
