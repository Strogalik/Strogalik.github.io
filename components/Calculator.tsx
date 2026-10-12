'use client';
import { useState } from 'react';
import spec from '@/content/calculator-spec.json';
import { conversion, manualWork, numeric } from '@/lib/calculator';
const fmt = (value: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 3 }).format(value);
const signed = (value: number) => (value > 0 ? '+' : '') + fmt(value);
export function Calculator() {
  const [mode, setMode] = useState<'conversion'|'manualWork'>('conversion');
  const [values, setValues] = useState<Record<string,string>>({requests:'400',baseRate:'10',scenarioRate:'12',people:'5',minutesPerDay:'30',workingDays:'22'});
  const model = spec[mode]; let error = ''; let result;
  try {
    const numbers = model.inputs.map(input => numeric(values[input.key], 'max' in input ? input.max as number : Infinity));
    result = mode === 'conversion' ? conversion(numbers[0],numbers[1],numbers[2]) : manualWork(numbers[0],numbers[1],numbers[2]);
  } catch (e) { error = (e as Error).message; }
  return <div className="calculator"><div className="calculator-input"><div className="mode-controls" aria-label="Режим расчёта"><button type="button" aria-pressed={mode === 'conversion'} onClick={() => setMode('conversion')}>Конверсия</button><button type="button" aria-pressed={mode === 'manualWork'} onClick={() => setMode('manualWork')}>Ручная работа</button></div>
    {model.inputs.map(input => <label key={input.key} htmlFor={`calc-${input.key}`}>{input.label}<input id={`calc-${input.key}`} type="text" inputMode="decimal" value={values[input.key]} aria-invalid={!!error} aria-describedby={error ? 'calc-error' : 'calc-note'} onChange={e => setValues({...values,[input.key]:e.target.value})} /></label>)}
    <p className="fineprint" id="calc-note">{model.note}</p>
  </div><div className="calculator-result" aria-live="polite">{error ? <p id="calc-error" role="alert">{error}</p> : typeof result === 'number' ? <><span className="data-label">Объём ручной работы</span><strong>{fmt(result)}</strong><p>часов в месяц</p><p className="fineprint">Сотрудники × минуты в день × рабочие дни ÷ 60</p></> : result && <><span className="data-label">Изменение количества сделок</span><strong>{signed(result.deltaDeals)}</strong><p>ожидаемых сделок в месяц</p><div className="comparison"><p>Сейчас <b>{fmt(result.baseDeals)}</b></p><p>Сценарий <b>{fmt(result.scenarioDeals)}</b></p></div><p>{signed(result.deltaPercentagePoints)} процентных пункта</p><p className="fineprint">Обращения × конверсия ÷ 100</p></>}<p className="fineprint">{spec.disclaimer}</p></div><noscript><p>Пример: 400 обращений при 10% → 40 ожидаемых сделок; при 12% → 48. Разница +8 сделок, +2 процентных пункта. Ручная работа: 5 × 30 × 22 ÷ 60 = 55 часов в месяц. Для редактирования нужен JavaScript.</p></noscript></div>;
}
