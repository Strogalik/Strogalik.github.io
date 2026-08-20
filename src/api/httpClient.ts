import type { AdminRoleItem, AdminUserItem, AlertRuleItem, ApprovalRouteDirectoryItem, AuditEventItem, CargoDirectoryItem, CertificateItem, CounterpartyDirectoryItem, CreateFuelingInput, DocumentTemplateDirectoryItem, DriverDirectoryItem, EdoDocument, EpdDocument, EpdTariffInfo, Fueling, FuelNormDirectoryItem, FuelTypeDirectoryItem, GasStationDirectoryItem, Integration, IntegrationJob, MedicalCheckItem, NotificationItem, ReasonDirectoryItem, RouteDirectoryItem, TechnicalInspectionItem, Trip, VehicleDirectoryItem } from '../data/types';
import type { ChartPoint } from '../components/LineChart';
import type { DistributionItem } from '../components/DistributionList';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const error = new Error(body?.message || `HTTP ${response.status}`);
    Object.assign(error, { status: response.status, body });
    throw error;
  }
  return response.json() as Promise<T>;
}

interface DashboardResponse {
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  active: number;
  completed: number;
  series: ChartPoint[];
  alerts: Array<{ id:string; tone:'danger'|'warning'; title:string; meta:string; href:string }>;
}


interface DriversReportResponse { total:number; averageRating:number; totalMileage:number; totalFuel:number; items:Array<{id:string;name:string;vehicle:string;trips:number;mileage:number;liters:number;fuelCost:number;maxVariance:number;delayed:number;onTimeRate:number;rating:number}>; }

interface FuelReportResponse {
  liters:number; cost:number; averagePrice:number; weightedConsumption:number; weightedNorm:number; anomalyCount:number; pendingCount:number;
  anomalies:Fueling[]; pending:Fueling[]; byVehicle:Array<{vehicle:string;liters:number;amount:number;variancePct:number}>; series:ChartPoint[];
}

interface FinanceReportResponse {
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  series: ChartPoint[];
  items: Trip[];
}

interface TripsReportResponse {
  total:number; inTransit:number; completed:number; delayed:number; completionRate:number;
  distribution:DistributionItem[]; risks:Trip[];
}
interface EpdReportResponse {
  total:number; accepted:number; awaitingSignature:number; errors:number; successRate:number;
  distribution:DistributionItem[]; attention:EpdDocument[];
}
interface EdoReportResponse {
  total:number; signed:number; awaitingSignature:number; approval:number; signedRate:number; amountInWork:number;
  distribution:DistributionItem[]; attention:EdoDocument[];
}

export const httpApi = {
  dashboard: () => request<DashboardResponse>('/dashboard'),
  trips: () => request<Trip[]>('/trips'),
  trip: (id: string) => request<Trip>(`/trips/${id}`),
  epd: () => request<EpdDocument[]>('/epd-documents'),
  epdDocument: (id: string) => request<EpdDocument>(`/epd-documents/${id}`),
  edo: () => request<EdoDocument[]>('/edo-documents'),
  edoDocument: (id: string) => request<EdoDocument>(`/edo-documents/${id}`),
  fuelings: () => request<Fueling[]>('/fuelings'),
  fueling: (id: string) => request<Fueling>(`/fuelings/${id}`),
  createFueling: (input: CreateFuelingInput) => request<Fueling>('/fuelings', { method:'POST', body:JSON.stringify(input) }),
  approveFueling: (id: string) => request<Fueling>(`/fuelings/${id}/approve`, { method:'POST' }),
  rejectFueling: (id: string) => request<Fueling>(`/fuelings/${id}/reject`, { method:'POST' }),
  notifications: () => request<NotificationItem[]>('/notifications'),
  integrations: () => request<Integration[]>('/integrations'),
  integration: (id: string) => request<Integration>(`/integrations/${id}`),
  integrationJobs: () => request<IntegrationJob[]>('/integration-jobs'),
  vehiclesDirectory: () => request<VehicleDirectoryItem[]>('/directories/vehicles'),
  driversDirectory: () => request<DriverDirectoryItem[]>('/directories/drivers'),
  counterpartiesDirectory: () => request<CounterpartyDirectoryItem[]>('/directories/counterparties'),
  routesDirectory: () => request<RouteDirectoryItem[]>('/directories/routes'),
  gasStationsDirectory: () => request<GasStationDirectoryItem[]>('/directories/gas-stations'),
  gasStationDirectory: (id: string) => request<GasStationDirectoryItem>(`/directories/gas-stations/${id}`),
  fuelTypesDirectory: () => request<FuelTypeDirectoryItem[]>('/directories/fuel-types'),
  fuelNormsDirectory: () => request<FuelNormDirectoryItem[]>('/directories/fuel-norms'),
  fuelNormDirectory: (id: string) => request<FuelNormDirectoryItem>(`/directories/fuel-norms/${id}`),
  cargoDirectory: () => request<CargoDirectoryItem[]>('/directories/cargo'),
  approvalRoutesDirectory: () => request<ApprovalRouteDirectoryItem[]>('/directories/approval-routes'),
  reasonsDirectory: () => request<ReasonDirectoryItem[]>('/directories/reasons'),
  documentTemplatesDirectory: () => request<DocumentTemplateDirectoryItem[]>('/directories/document-templates'),
  technicalInspections: () => request<TechnicalInspectionItem[]>('/mechanic/technical-control'),
  technicalInspection: (id: string) => request<TechnicalInspectionItem>(`/mechanic/technical-control/${id}`),
  medicalChecks: () => request<MedicalCheckItem[]>('/medical/checks'),
  medicalCheck: (id: string) => request<MedicalCheckItem>(`/medical/checks/${id}`),
  adminUsers: () => request<AdminUserItem[]>('/admin/users'),
  adminUser: (id: string) => request<AdminUserItem>(`/admin/users/${id}`),
  adminRoles: () => request<AdminRoleItem[]>('/admin/roles'),
  auditEvents: () => request<AuditEventItem[]>('/admin/audit'),
  certificates: () => request<CertificateItem[]>('/admin/certificates'),
  alertRules: () => request<AlertRuleItem[]>('/admin/alerts'),
  epdTariff: () => request<EpdTariffInfo>('/admin/epd-tariff'),
  driverProfile: () => request<DriverDirectoryItem>('/driver/profile'),
  driverTrips: () => request<Trip[]>('/driver/trips'),
  driverTrip: (id: string) => request<Trip>(`/driver/trips/${id}`),
  driverDocuments: () => request<EpdDocument[]>('/driver/documents'),
  driverFuelings: () => request<Fueling[]>('/driver/fuelings'),
  driversReport: () => request<DriversReportResponse>('/reports/drivers'),
  fuelReport: () => request<FuelReportResponse>('/reports/fuel'),
  financeReport: () => request<FinanceReportResponse>('/reports/finance'),
  tripsReport: () => request<TripsReportResponse>('/reports/trips'),
  epdReport: () => request<EpdReportResponse>('/reports/epd'),
  edoReport: () => request<EdoReportResponse>('/reports/edo'),
};
