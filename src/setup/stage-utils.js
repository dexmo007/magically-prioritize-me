export function initStages([firstStage, ...followingStages]) {
  return [
    {
      ...firstStage,
      percentageComplete: 0,
      status: 'current',
      noLink: true,
    },
    ...followingStages.map((stage) => ({
      ...stage,
      percentageComplete: 0,
      status: 'unvisited',
      noLink: true,
    })),
  ];
}

export function advance(stages) {
  const next = stages.findIndex(({ status }) => status === 'unvisited');
  if (next === -1) {
    return [
      ...stages.slice(0, stages.length - 1),
      {
        ...stages[stages.length - 1],
        percentageComplete: 100,
        status: 'visited',
      },
    ];
  }
  return [
    ...stages.slice(0, next - 1),
    { ...stages[next - 1], percentageComplete: 100, status: 'visited' },
    { ...stages[next], status: 'current' },
    ...stages.slice(next + 1),
  ];
}
