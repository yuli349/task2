import { Entity } from './typings/input';
import { Slide } from './typings/output';
import { Store } from './store';

export function prepareData(entities: Entity[], options: { sprintId: number }): Slide[] {
    if (!Array.isArray(entities)) return [];
    if (!options || !options.sprintId) return [];

    const store = new Store(entities);
    const sprint = store.getSprint(options.sprintId);
    if (!sprint) return [];

    return [];
}
