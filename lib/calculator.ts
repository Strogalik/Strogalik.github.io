export function numeric(raw: string, max = Infinity) {
  if (!raw.trim()) throw new Error('Заполните все поля для расчёта');
  const value = Number(raw.replace(',', '.'));
  if (!Number.isFinite(value) || value < 0 || value > max) throw new Error(max === 100 ? 'Конверсия должна быть от 0 до 100%' : 'Введите конечное число не меньше нуля');
  return value;
}
export function conversion(requests: number, baseRate: number, scenarioRate: number) {
  [requests, baseRate, scenarioRate].forEach((value,i) => numeric(String(value), i ? 100 : Infinity));
  const baseDeals = requests * baseRate / 100, scenarioDeals = requests * scenarioRate / 100;
  if (![baseDeals, scenarioDeals].every(Number.isFinite)) throw new Error('Значения слишком велики для расчёта');
  return { baseDeals, scenarioDeals, deltaDeals: scenarioDeals - baseDeals, deltaPercentagePoints: scenarioRate - baseRate };
}
export function manualWork(people: number, minutes: number, days: number) {
  [people,minutes,days].forEach(value => numeric(String(value)));
  const hours = people * minutes * days / 60;
  if (!Number.isFinite(hours)) throw new Error('Значения слишком велики для расчёта');
  return hours;
}
