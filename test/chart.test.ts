import { prepareChartSlide } from '../src/slides/chart';
import { Entity } from '../src/typings/input';
import { Store } from '../src/store';

const entities: Entity[] = require('../examples/input/input.json');
const expectedChart = require('../examples/output/chart.json');

const SPRINT_ID = 977;
const store = new Store(entities);
const sprint = store.getSprint(SPRINT_ID)!;

test('Подготовка слайда коммитов', () => {
    expect(prepareChartSlide(store, sprint)).toEqual(expectedChart);
});
