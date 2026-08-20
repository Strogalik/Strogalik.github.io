import type { FuelAnomalyType, FuelPaymentMethod } from '../data/types';

export const fuelAnomalyLabel: Record<FuelAnomalyType, string> = {
  duplicate: 'Возможный дубль',
  price: 'Цена выше порога',
  tank: 'Превышение объёма бака',
  odometer: 'Ошибка одометра',
  norm: 'Расход выше нормы',
};

export const fuelAnomalyShortLabel: Record<FuelAnomalyType, string> = {
  duplicate: 'Дубль',
  price: 'Цена',
  tank: 'Бак',
  odometer: 'Одометр',
  norm: 'Расход',
};

export const paymentLabel: Record<FuelPaymentMethod, string> = {
  cash: 'Наличные',
  corporate_card: 'Корпоративная карта',
  fuel_card: 'Топливная карта',
  other: 'Иной способ',
};

export const rub = (value: number) => `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value)} ₽`;
export const num = (value: number, digits = 1) => new Intl.NumberFormat('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
