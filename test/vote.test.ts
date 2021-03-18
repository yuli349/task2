import { prepareVoteSlide } from '../src/slides/vote';
import { Entity } from '../src/typings/input';
import { Store } from '../src/store';

const entities: Entity[] = require('../examples/input/input.json');
const expectedVote = require('../examples/output/vote.json');

const SPRINT_ID = 977;
const store = new Store(entities);
const sprint = store.getSprint(SPRINT_ID)!;

test('Подготовка слайда голосования', () => {
    expect(prepareVoteSlide(store, sprint)).toEqual(expectedVote);
});
