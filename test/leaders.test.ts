import { prepareLeadersSlide } from '../src/slides/leaders';
import { Entity } from '../src/typings/input';
import { Store } from '../src/store';

const entities: Entity[] = require('../examples/input/input.json');
const expectedLeaders = require('../examples/output/leaders.json');

const SPRINT_ID = 977;
const store = new Store(entities);
const sprint = store.getSprint(SPRINT_ID)!;

test('Подготовка слайда лидеров', () => {
    expect(prepareLeadersSlide(store, sprint)).toEqual(expectedLeaders);
});
