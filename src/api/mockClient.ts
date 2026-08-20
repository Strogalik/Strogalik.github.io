import type { CreateFuelingInput, FuelAnomalyType } from '../data/types';
import { counterpartiesDirectory, dashboardSeries, driversDirectory, edoDocuments, epdDocuments, fuelings, fuelNormsDirectory, fuelTypesDirectory, gasStationsDirectory, integrationJobs, integrations, notifications, routesDirectory, trips, vehiclesDirectory } from '../data/mockDb';
import { adminRoles, adminUsers, alertRules, approvalRoutesDirectory, auditEvents, cargoDirectory, certificates, documentTemplatesDirectory, epdTariff, medicalChecks, reasonsDirectory, technicalInspections } from '../data/finalData';

const pause = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async dashboard() {
    await pause();
    const revenue = trips.reduce((sum, trip) => sum + trip.revenue, 0);
    const costs = trips.reduce((sum, trip) => sum + trip.costs, 0);
    const active = trips.filter((trip) => trip.status === 'in_transit' || trip.status === 'assigned').length;
    const completed = trips.filter((trip) => trip.status === 'completed').length;
    return {
      revenue,
      costs,
      profit: revenue - costs,
      margin: revenue ? ((revenue - costs) / revenue) * 100 : 0,
      active,
      completed,
      series: dashboardSeries,
      alerts: [
        { id:'a1', tone:'danger' as const, title:'ЭПЛ №2339 — ошибка обмена', meta:'Рейс TR-0244 · Saby', href:'/epd/epl-2339' },
        { id:'a2', tone:'warning' as const, title:'TR-0244 идёт с задержкой 46 мин', meta:'Москва → Нижний Новгород', href:'/trips/trip-244' },
        { id:'a3', tone:'warning' as const, title:'УПД №251 ожидает подписи', meta:'ООО «ТрансЛогистика»', href:'/edo/edo-251' },
      ],
    };
  },
  async trips() { await pause(); return trips; },
  async trip(id: string) { await pause(); return trips.find((item) => item.id === id) ?? trips[0]; },
  async epd() { await pause(); return epdDocuments; },
  async epdDocument(id: string) { await pause(); return epdDocuments.find((item) => item.id === id) ?? epdDocuments[0]; },
  async edo() { await pause(); return edoDocuments; },
  async edoDocument(id: string) { await pause(); return edoDocuments.find((item) => item.id === id) ?? edoDocuments[0]; },

  async notifications() { await pause(); return notifications; },
  async integrations() { await pause(); return integrations; },
  async integration(id: string) { await pause(); return integrations.find((item) => item.id === id) ?? integrations[0]; },
  async integrationJobs() { await pause(); return integrationJobs; },
  async vehiclesDirectory() { await pause(); return vehiclesDirectory; },
  async driversDirectory() { await pause(); return driversDirectory; },
  async counterpartiesDirectory() { await pause(); return counterpartiesDirectory; },
  async routesDirectory() { await pause(); return routesDirectory; },
  async gasStationsDirectory() { await pause(); return gasStationsDirectory; },
  async gasStationDirectory(id: string) { await pause(); return gasStationsDirectory.find((item) => item.id === id) ?? gasStationsDirectory[0]; },
  async fuelTypesDirectory() { await pause(); return fuelTypesDirectory; },
  async fuelNormsDirectory() { await pause(); return fuelNormsDirectory; },
  async fuelNormDirectory(id: string) { await pause(); return fuelNormsDirectory.find((item) => item.id === id) ?? fuelNormsDirectory[0]; },
  async cargoDirectory() { await pause(); return cargoDirectory; },
  async approvalRoutesDirectory() { await pause(); return approvalRoutesDirectory; },
  async reasonsDirectory() { await pause(); return reasonsDirectory; },
  async documentTemplatesDirectory() { await pause(); return documentTemplatesDirectory; },
  async technicalInspections() { await pause(); return technicalInspections; },
  async technicalInspection(id: string) { await pause(); return technicalInspections.find(item => item.id === id) ?? technicalInspections[0]; },
  async medicalChecks() { await pause(); return medicalChecks; },
  async medicalCheck(id: string) { await pause(); return medicalChecks.find(item => item.id === id || item.epdId === id) ?? medicalChecks[0]; },
  async adminUsers() { await pause(); return adminUsers; },
  async adminUser(id: string) { await pause(); return adminUsers.find(item => item.id === id) ?? adminUsers[0]; },
  async adminRoles() { await pause(); return adminRoles; },
  async auditEvents() { await pause(); return auditEvents; },
  async certificates() { await pause(); return certificates; },
  async alertRules() { await pause(); return alertRules; },
  async epdTariff() { await pause(); return epdTariff; },

  async driverProfile() { await pause(); return driversDirectory.find(item => item.name === 'Иван Петров') ?? driversDirectory[0]; },
  async driverTrips() { await pause(); return trips.filter(item => item.driver === 'Иван Петров'); },
  async driverTrip(id: string) { await pause(); return trips.find(item => item.id === id && item.driver === 'Иван Петров') ?? trips.find(item => item.driver === 'Иван Петров') ?? trips[0]; },
  async driverDocuments() { await pause(); return epdDocuments.filter(item => item.driver === 'Иван Петров'); },
  async driverFuelings() { await pause(); return fuelings.filter(item => item.driver === 'Иван Петров'); },

  async fuelings() { await pause(); return fuelings; },
  async fueling(id: string) { await pause(); return fuelings.find((item) => item.id === id) ?? fuelings[0]; },
  async createFueling(input: CreateFuelingInput) {
    await pause(260);
    const amount = Math.round(input.liters * input.pricePerLiter * 100) / 100;
    const vehicle = vehiclesDirectory.find(item => input.vehicle.includes(item.regNumber));
    const anomalies: FuelAnomalyType[] = [];
    if (vehicle && input.liters > vehicle.tankLiters) anomalies.push('tank');
    if (input.pricePerLiter > 84) anomalies.push('price');
    const sameVehicleRecent = fuelings.find(item => item.vehicle === input.vehicle && item.dateTime === input.dateTime);
    if (sameVehicleRecent) anomalies.push('duplicate');
    const id = `fuel-${Date.now()}`;
    const item = {
      id, number:`ГСМ-${String(Date.now()).slice(-4)}`, dateTime:input.dateTime || 'сейчас', vehicle:input.vehicle, driver:input.driver, fuelType:input.fuelType,
      liters:input.liters, pricePerLiter:input.pricePerLiter, amount, gasStation:input.gasStation, address:input.address, receiptNumber:input.receiptNumber,
      receiptFile:input.receiptFile || 'receipt-new.jpg', odometerKm:input.odometerKm, tripId:input.tripId, tripNumber:input.tripNumber, paymentMethod:input.paymentMethod,
      status: anomalies.length ? 'pending_approval' as const : 'confirmed' as const, anomalies, actualConsumption:vehicle?.consumptionNorm ?? 0, normConsumption:vehicle?.consumptionNorm ?? 0, variancePct:0,
      source:'manual' as const, oneCStatus: anomalies.length ? 'blocked' as const : 'ready' as const, comment:input.comment,
    };
    fuelings.unshift(item);
    return item;
  },
  async approveFueling(id: string) {
    await pause(220);
    const item = fuelings.find(row => row.id === id);
    if (!item) return fuelings[0];
    item.status = 'confirmed'; item.oneCStatus = 'ready';
    return item;
  },
  async rejectFueling(id: string) {
    await pause(220);
    const item = fuelings.find(row => row.id === id);
    if (!item) return fuelings[0];
    item.status = 'rejected'; item.oneCStatus = 'blocked';
    return item;
  },

  async driversReport() {
    await pause();
    const items = driversDirectory.map(driver => {
      const driverTrips = trips.filter(trip => trip.driver === driver.name);
      const driverFuel = fuelings.filter(row => row.driver === driver.name && row.status !== 'rejected');
      const mileage = driverTrips.reduce((sum,trip)=>sum+(trip.actualMileageKm ?? trip.plannedMileageKm),0);
      const liters = driverFuel.reduce((sum,row)=>sum+row.liters,0);
      const fuelCost = driverFuel.reduce((sum,row)=>sum+row.amount,0);
      const maxVariance = driverFuel.length ? Math.max(...driverFuel.map(row=>row.variancePct)) : 0;
      const delayed = driverTrips.filter(trip=>trip.risk==='delay').length;
      const onTimeRate = Math.round(((driverTrips.length-delayed)/Math.max(1,driverTrips.length))*100);
      const fuelScore = Math.max(0, Math.min(100, 100 - Math.max(0,maxVariance)*2));
      const safetyScore = delayed ? 70 : 100;
      const rating = Math.round(fuelScore*.4 + onTimeRate*.3 + safetyScore*.3);
      return { id:driver.id, name:driver.name, vehicle:driver.vehicle, trips:driverTrips.length, mileage, liters, fuelCost, maxVariance, delayed, onTimeRate, rating };
    }).sort((a,b)=>b.rating-a.rating);
    return { total:items.length, averageRating:Math.round(items.reduce((sum,item)=>sum+item.rating,0)/Math.max(1,items.length)), totalMileage:items.reduce((sum,item)=>sum+item.mileage,0), totalFuel:items.reduce((sum,item)=>sum+item.liters,0), items };
  },
  async fuelReport() {
    await pause();
    const confirmed = fuelings.filter(item => item.status !== 'rejected');
    const liters = confirmed.reduce((sum, item) => sum + item.liters, 0);
    const cost = confirmed.reduce((sum, item) => sum + item.amount, 0);
    const anomalies = fuelings.filter(item => item.anomalies.length);
    const pending = fuelings.filter(item => item.status === 'pending_approval');
    const weightedConsumption = confirmed.reduce((sum, item) => sum + item.actualConsumption * item.liters, 0) / Math.max(liters, 1);
    const weightedNorm = confirmed.reduce((sum, item) => sum + item.normConsumption * item.liters, 0) / Math.max(liters, 1);
    const byVehicle = Array.from(new Set(confirmed.map(item => item.vehicle))).map(vehicle => {
      const rows = confirmed.filter(item => item.vehicle === vehicle);
      return { vehicle, liters:rows.reduce((sum,row)=>sum+row.liters,0), amount:rows.reduce((sum,row)=>sum+row.amount,0), variancePct:Math.max(...rows.map(row=>row.variancePct)) };
    }).sort((a,b)=>b.amount-a.amount);
    const days = ['12 авг','13 авг','14 авг','15 авг','16 авг','17 авг','18 авг'];
    const costs = [24,31,28,37,45,52,58];
    return {
      liters, cost, averagePrice: cost / Math.max(liters, 1), weightedConsumption, weightedNorm, anomalyCount:anomalies.length, pendingCount:pending.length, anomalies, pending, byVehicle,
      series: days.map((label,index) => ({ label, revenue:costs[index], costs:0 })),
    };
  },
  async financeReport() {
    await pause();
    const items = trips.filter((trip) => trip.revenue > 0);
    const revenue = items.reduce((sum, item) => sum + item.revenue, 0);
    const costs = items.reduce((sum, item) => sum + item.costs, 0);
    return { revenue, costs, profit: revenue - costs, margin: ((revenue - costs) / revenue) * 100, series: dashboardSeries, items };
  },
  async tripsReport() {
    await pause();
    const total = trips.length;
    const inTransit = trips.filter((item) => item.status === 'in_transit').length;
    const completed = trips.filter((item) => item.status === 'completed').length;
    const delayed = trips.filter((item) => item.risk === 'delay').length;
    return {
      total,
      inTransit,
      completed,
      delayed,
      completionRate: Math.round((completed / Math.max(1, total - trips.filter(item => item.status === 'cancelled').length)) * 100),
      distribution: [
        { label:'В пути', value:inTransit, total, tone:'blue' as const },
        { label:'Назначены', value:trips.filter(item => item.status === 'assigned').length, total, tone:'powder' as const },
        { label:'Запланированы', value:trips.filter(item => item.status === 'planned').length, total, tone:'navy' as const },
        { label:'Завершены', value:completed, total, tone:'green' as const },
        { label:'Отменены', value:trips.filter(item => item.status === 'cancelled').length, total, tone:'gray' as const },
      ],
      risks: trips.filter(item => item.risk),
    };
  },
  async epdReport() {
    await pause();
    const total = epdDocuments.length;
    const accepted = epdDocuments.filter(item => item.status === 'accepted').length;
    const awaitingSignature = epdDocuments.filter(item => item.status === 'awaiting_signature').length;
    const errors = epdDocuments.filter(item => item.status === 'error').length;
    const attention = epdDocuments.filter(item => item.status === 'error' || item.status === 'awaiting_signature' || item.status === 'rejected');
    return {
      total,
      accepted,
      awaitingSignature,
      errors,
      successRate: Math.round((accepted / Math.max(1, total)) * 100),
      distribution: [
        { label:'Принято', value:accepted, total, tone:'green' as const },
        { label:'Отправлено', value:epdDocuments.filter(item => item.status === 'sent' || item.status === 'delivered').length, total, tone:'blue' as const },
        { label:'Ждут подписи', value:awaitingSignature, total, tone:'amber' as const },
        { label:'Черновики', value:epdDocuments.filter(item => item.status === 'draft').length, total, tone:'gray' as const },
        { label:'Ошибки / отклонения', value:epdDocuments.filter(item => item.status === 'error' || item.status === 'rejected').length, total, tone:'red' as const },
      ],
      attention,
    };
  },
  async edoReport() {
    await pause();
    const total = edoDocuments.length;
    const signed = edoDocuments.filter(item => item.status === 'signed').length;
    const awaitingSignature = edoDocuments.filter(item => item.status === 'awaiting_signature').length;
    const approval = edoDocuments.filter(item => item.status === 'approval').length;
    const attention = edoDocuments.filter(item => item.status !== 'signed');
    return {
      total,
      signed,
      awaitingSignature,
      approval,
      signedRate: Math.round((signed / Math.max(1, total)) * 100),
      amountInWork: attention.reduce((sum, item) => sum + item.amount, 0),
      distribution: [
        { label:'УПД', value:edoDocuments.filter(item => item.type === 'УПД').length, total, tone:'blue' as const },
        { label:'Акты', value:edoDocuments.filter(item => item.type === 'Акт').length, total, tone:'powder' as const },
        { label:'Счета', value:edoDocuments.filter(item => item.type === 'Счёт').length, total, tone:'navy' as const },
      ],
      attention,
    };
  },
};
