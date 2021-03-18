import { Entity } from '../src/typings/input';
import { Store } from '../src/store';
import { prepareDiagramSlide } from '../src/slides/diagram';

const entities: Entity[] = require('../examples/input/input.json');
const expectedDiagram = require('../examples/output/diagram.json');

const SPRINT_ID = 977;
const store = new Store(entities);
const sprint = store.getSprint(SPRINT_ID)!;

test('Подготовка слайда размера коммитов', () => {
    expect(prepareDiagramSlide(store, sprint)).toEqual(expectedDiagram);
});
