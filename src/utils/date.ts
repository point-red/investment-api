export function addDay(date: Date | string, days: number): Date {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
