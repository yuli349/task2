import { prepareActivitySlide } from '../src/slides/activity';
import { Entity } from '../src/typings/input';
import { Store } from '../src/store';

const entities: Entity[] = require('../examples/input/input.json');
const expectedActivity = require('../examples/output/activity.json');

const SPRINT_ID = 977;
const store = new Store(entities);
const sprint = store.getSprint(SPRINT_ID)!;

test('Подготовка слайда активности', () => {
    expect(prepareActivitySlide(store, sprint)).toEqual(expectedActivity);
});
