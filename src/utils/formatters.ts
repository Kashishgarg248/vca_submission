export function formatFollowers(count: number): string {
  if (count >= 1_000_000_000) return (count / 1_000_000_000).toFixed(1) + "B";
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + "M";
  if (count >= 1_000) return (count / 1_000).toFixed(1) + "K";
  return count.toString();
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || rate === null) return "N/A";
  // The raw rate is a decimal (e.g. 0.012 = 1.2%) — display correctly
  return (rate * 100).toFixed(2) + "%";
}

export function formatNumber(n: number | undefined): string {
  if (n === undefined || n === null) return "N/A";
  return formatFollowers(n);
}
