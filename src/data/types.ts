export type TripStatus = 'planned' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
export type DocStatus = 'draft' | 'awaiting_signature' | 'sent' | 'delivered' | 'accepted' | 'rejected' | 'error';
export type EdoStatus = 'approval' | 'awaiting_signature' | 'signed' | 'rejected';

export interface Trip {
  id: string;
  number: string;
  status: TripStatus;
  origin: string;
  destination: string;
  counterparty: string;
  customer: string;
  consignee: string;
  vehicle: string;
  driver: string;
  cargo: string;
  weightKg: number;
  plannedAt: string;
  actualAt?: string;
  plannedMileageKm: number;
  actualMileageKm?: number;
  revenue: number;
  costs: number;
  margin: number;
  documentsReady: number;
  documentsTotal: number;
  risk?: 'delay' | 'documents' | 'margin';
}

export interface EpdDocument {
  id: string;
  number: string;
  type: 'ЭПЛ' | 'ЭТрН' | 'ЭЗЗ';
  tripId: string;
  tripNumber: string;
  counterparty: string;
  status: DocStatus;
  signature: string;
  saby: string;
  createdAt: string;
  driver: string;
  vehicle: string;
}

export interface EdoDocument {
  id: string;
  number: string;
  type: 'УПД' | 'Акт' | 'Счёт';
  tripId: string;
  tripNumber: string;
  counterparty: string;
  amount: number;
  status: EdoStatus;
  approval: string;
  createdAt: string;
}

export type NotificationSeverity = 'critical' | 'warning' | 'info';
export type NotificationCategory = 'trips' | 'epd' | 'edo' | 'integrations' | 'finance' | 'fuel';

export interface NotificationItem {
  id: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  title: string;
  meta: string;
  time: string;
  href: string;
  unread: boolean;
}

export type IntegrationStatus = 'connected' | 'degraded' | 'error' | 'not_configured';
export interface Integration {
  id: 'saby' | '1c' | 'telematics' | 'fuel-cards';
  name: string;
  subtitle: string;
  status: IntegrationStatus;
  lastSync: string;
  queue: number;
  errors: number;
  environment: string;
  organization: string;
  safeId: string;
  description: string;
}

export type IntegrationJobStatus = 'queued' | 'processing' | 'success' | 'error';
export interface IntegrationJob {
  id: string;
  system: 'Saby' | '1С/ERP';
  operation: string;
  entity: string;
  status: IntegrationJobStatus;
  externalId: string;
  createdAt: string;
  attempts: number;
}

export interface VehicleDirectoryItem {
  id: string;
  regNumber: string;
  vin: string;
  brandModel: string;
  type: string;
  capacityKg: number;
  fuelType: string;
  tankLiters: number;
  consumptionNorm: number;
  status: 'active' | 'service' | 'inactive';
}

export interface DriverDirectoryItem {
  id: string;
  name: string;
  personnelNumber: string;
  phone: string;
  status: 'active' | 'on_trip' | 'inactive';
  vehicle: string;
  epdReady: boolean;
}

export interface CounterpartyDirectoryItem {
  id: string;
  name: string;
  inn: string;
  kpp: string;
  address: string;
  contracts: number;
  edoStatus: 'connected' | 'roaming' | 'attention';
}

export interface RouteDirectoryItem {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  plannedDuration: string;
  points: number;
  status: 'active' | 'draft';
}

export interface GasStationDirectoryItem {
  id: string;
  name: string;
  network: string;
  address: string;
  coordinates: string;
  fuelTypes: string[];
  status: 'active' | 'inactive';
  linkedFuelings: number;
}

export interface FuelTypeDirectoryItem {
  id: string;
  code: string;
  name: string;
  unit: 'л';
  stationCount: number;
  status: 'active' | 'inactive';
}

export interface FuelNormCoefficient {
  id: string;
  label: string;
  valuePct: number;
  description: string;
}

export interface FuelNormDirectoryItem {
  id: string;
  vehicleId: string;
  vehicle: string;
  fuelType: string;
  baseNorm: number;
  effectiveFrom: string;
  status: 'active' | 'draft';
  coefficients: FuelNormCoefficient[];
}


export type FuelingStatus = 'confirmed' | 'pending_approval' | 'rejected';
export type FuelAnomalyType = 'duplicate' | 'price' | 'tank' | 'odometer' | 'norm';
export type FuelPaymentMethod = 'cash' | 'corporate_card' | 'fuel_card' | 'other';

export interface Fueling {
  id: string;
  number: string;
  dateTime: string;
  vehicle: string;
  driver: string;
  fuelType: string;
  liters: number;
  pricePerLiter: number;
  amount: number;
  gasStation: string;
  address: string;
  receiptNumber: string;
  receiptFile: string;
  odometerKm: number;
  tripId: string;
  tripNumber: string;
  paymentMethod: FuelPaymentMethod;
  status: FuelingStatus;
  anomalies: FuelAnomalyType[];
  actualConsumption: number;
  normConsumption: number;
  variancePct: number;
  source: 'manual' | 'fuel_card';
  oneCStatus: 'ready' | 'exported' | 'blocked';
  comment?: string;
}

export interface CreateFuelingInput {
  dateTime: string;
  vehicle: string;
  driver: string;
  fuelType: string;
  liters: number;
  pricePerLiter: number;
  gasStation: string;
  address: string;
  receiptNumber: string;
  receiptFile: string;
  odometerKm: number;
  tripId: string;
  tripNumber: string;
  paymentMethod: FuelPaymentMethod;
  comment?: string;
}

export interface CargoDirectoryItem {
  id: string;
  name: string;
  unit: string;
  category: string;
  specialConditions: string;
  status: 'active' | 'inactive';
}

export interface ApprovalRouteDirectoryItem {
  id: string;
  name: string;
  documentType: string;
  steps: string[];
  organization: string;
  status: 'active' | 'draft';
}

export interface ReasonDirectoryItem {
  id: string;
  category: 'idle' | 'cancel' | 'deviation' | 'error';
  label: string;
  requiresComment: boolean;
  status: 'active' | 'inactive';
}

export interface DocumentTemplateDirectoryItem {
  id: string;
  name: string;
  type: string;
  approvalRoute: string;
  updatedAt: string;
  status: 'active' | 'draft';
}

export type TechnicalInspectionStatus = 'ready' | 'attention' | 'blocked';
export interface TechnicalInspectionItem {
  id: string;
  vehicleId: string;
  vehicle: string;
  regNumber: string;
  odometerKm: number;
  fuelLiters: number;
  tankLiters: number;
  inspectedAt: string;
  inspector: string;
  status: TechnicalInspectionStatus;
  note: string;
  linkedTrip?: string;
}

export type MedicalCheckStatus = 'awaiting' | 'passed' | 'not_passed';
export interface MedicalCheckItem {
  id: string;
  epdId: string;
  documentNumber: string;
  tripId: string;
  tripNumber: string;
  driver: string;
  vehicle: string;
  plannedAt: string;
  status: MedicalCheckStatus;
  checkedAt?: string;
  medicalWorker?: string;
  note?: string;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  branch: string;
  twoFactor: boolean;
  status: 'active' | 'blocked' | 'invited';
  lastSeen: string;
}

export interface AdminRoleItem {
  id: string;
  name: string;
  users: number;
  scope: string;
  description: string;
  permissions: string[];
  status: 'system' | 'custom';
}

export interface AuditEventItem {
  id: string;
  at: string;
  actor: string;
  action: string;
  object: string;
  result: 'success' | 'warning' | 'denied';
  ip: string;
  details: string;
}

export interface CertificateItem {
  id: string;
  owner: string;
  fingerprint: string;
  scope: string;
  expiresAt: string;
  daysLeft: number;
  status: 'valid' | 'expiring' | 'expired';
}

export interface AlertRuleItem {
  id: string;
  title: string;
  module: string;
  threshold: string;
  channels: string[];
  enabled: boolean;
}

export interface EpdTariffInfo {
  packageName: string;
  included: number;
  used: number;
  unitPrice: number;
  period: string;
  projected: number;
}
