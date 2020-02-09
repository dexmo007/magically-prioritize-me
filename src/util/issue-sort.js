export function sortByDebatabilty(issues) {
  issues = [...issues];
  issues.sort((a, b) => {
    const cmp = (b.touched_count || 0) - (a.touched_count || 0);
    if (cmp !== 0) {
      return cmp;
    }
    if (typeof a.estimate === 'undefined') {
      if (typeof b.estimate !== 'undefined') {
        return 1;
      } else {
        return 0;
      }
    }
    if (typeof b.estimate === 'undefined') {
      return -1;
    }
    return b.estimate - a.estimate;
  });
  return issues;
}
