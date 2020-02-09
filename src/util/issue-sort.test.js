import { sortByDebatabilty } from './issue-sort';

const neverTouched = { id: 'neverTouched' };
const neverTouched3 = { id: 'neverTouched3', estimate: 3 };
const touchedOnce = { id: 'touchedOnce', touched_count: 1 };
const touchedOnce1 = { id: 'touchedOnce1', touched_count: 1, estimate: 1 };
const touchedOnce2 = { id: 'touchedOnce2', touched_count: 1, estimate: 2 };
const touchedTwice = { id: 'touchedTwice', touched_count: 2 };

describe('issue-sort/by-debatability', () => {
  it.each([
    [
      [neverTouched, touchedOnce],
      [touchedOnce, neverTouched],
    ],
    [
      [neverTouched, touchedOnce, neverTouched3],
      [touchedOnce, neverTouched3, neverTouched],
    ],
    [
      [neverTouched, touchedOnce, neverTouched3, touchedOnce1],
      [touchedOnce1, touchedOnce, neverTouched3, neverTouched],
    ],
    [
      [neverTouched, touchedOnce, touchedOnce2, neverTouched3, touchedOnce1],
      [touchedOnce2, touchedOnce1, touchedOnce, neverTouched3, neverTouched],
    ],
    [
      [
        neverTouched,
        touchedOnce,
        touchedOnce2,
        touchedTwice,
        neverTouched3,
        touchedOnce1,
      ],
      [
        touchedTwice,
        touchedOnce2,
        touchedOnce1,
        touchedOnce,
        neverTouched3,
        neverTouched,
      ],
    ],
  ])('should sort correctly', (input, expected) => {
    expect(sortByDebatabilty(input)).toEqual(expected);
  });
});
