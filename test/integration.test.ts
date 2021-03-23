import { Entity } from '../src/typings/input';
import { prepareData } from '../src';

const input: Entity[] = require('../examples/input/input.json');
const output = require('../examples/output/output.json');
const emptyOutput = require('../examples/output/empty.json');

const SPRINT_ID = 977;
const EMPTY_SPRINT_ID = 994;

describe('Интеграционный тест', () => {
    test('Проверка всех данных', () => {
        expect(prepareData(input, { sprintId: SPRINT_ID })).toEqual(output);
    });

    test('Пустой спринт', () => {
        expect(prepareData(input, { sprintId: EMPTY_SPRINT_ID })).toEqual(emptyOutput);
    });
});
