import arrayChunk from './array-chunk';

describe('array-chunk', () => {
  it('should stay empty', () => {
    expect(arrayChunk([])).toEqual([]);
  });

  it.each([
    [[1, 2, 3], 1, [[1, 2, 3]]],
    [[1], 2, [[1]]],
    [[1, 2], 2, [[1], [2]]],
    [[1, 2, 3], 2, [[1, 2], [3]]],
    [
      [1, 2, 3, 4],
      2,
      [
        [1, 2],
        [3, 4],
      ],
    ],
    [[], 4, []],
    [[1], 4, [[1]]],
    [[1, 2], 4, [[1], [2]]],
    [[1, 2, 3], 4, [[1], [2], [3]]],
    [[1, 2, 3, 4], 4, [[1], [2], [3], [4]]],
    [[1, 2, 3, 4, 5], 4, [[1, 2], [3], [4], [5]]],
  ])('%j into %i chunks', (arr, n, expected) => {
    expect(arrayChunk(arr, n)).toEqual(expected);
  });
});
