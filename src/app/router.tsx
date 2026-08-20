import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../layouts/AppShell';
import { DashboardPage } from '../pages/DashboardPage';
import { TripsPage } from '../pages/TripsPage';
import { TripDetailsPage } from '../pages/TripDetailsPage';
import { FuelPage } from '../pages/FuelPage';
import { FuelNewPage } from '../pages/FuelNewPage';
import { FuelDetailsPage } from '../pages/FuelDetailsPage';
import { FuelAnomaliesPage } from '../pages/FuelAnomaliesPage';
import { FuelApprovalsPage } from '../pages/FuelApprovalsPage';
import { FuelReportPage } from '../pages/FuelReportPage';
import { EpdPage } from '../pages/EpdPage';
import { EplDetailsPage } from '../pages/EplDetailsPage';
import { EdoPage } from '../pages/EdoPage';
import { EdoDetailsPage } from '../pages/EdoDetailsPage';
import { ReportsHubPage } from '../pages/ReportsHubPage';
import { DriversReportPage } from '../pages/DriversReportPage';
import { TripsReportPage } from '../pages/TripsReportPage';
import { EpdReportPage } from '../pages/EpdReportPage';
import { EdoReportPage } from '../pages/EdoReportPage';
import { FinanceReportPage } from '../pages/FinanceReportPage';
import { DirectoriesPage } from '../pages/DirectoriesPage';
import { DirectoryRegistryPage } from '../pages/DirectoryRegistryPage';
import { GasStationDetailsPage } from '../pages/GasStationDetailsPage';
import { FuelNormDetailsPage } from '../pages/FuelNormDetailsPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { IntegrationsPage } from '../pages/IntegrationsPage';
import { IntegrationDetailsPage } from '../pages/IntegrationDetailsPage';
import { IntegrationJobsPage } from '../pages/IntegrationJobsPage';
import { DriverHomePage } from '../pages/DriverHomePage';
import { DriverTripsPage } from '../pages/DriverTripsPage';
import { DriverTripDetailsPage } from '../pages/DriverTripDetailsPage';
import { DriverDocumentsPage } from '../pages/DriverDocumentsPage';
import { DriverFuelNewPage } from '../pages/DriverFuelNewPage';

import { TripNewPage } from '../pages/TripNewPage';
import { EpdNewPage } from '../pages/EpdNewPage';
import { EdoNewPage } from '../pages/EdoNewPage';
import { EdoReconciliationPage } from '../pages/EdoReconciliationPage';
import { MechanicHomePage } from '../pages/MechanicHomePage';
import { MechanicInspectionPage } from '../pages/MechanicInspectionPage';
import { MedicalHomePage } from '../pages/MedicalHomePage';
import { MedicalDocumentsPage } from '../pages/MedicalDocumentsPage';
import { MedicalCheckPage } from '../pages/MedicalCheckPage';
import { AdminHubPage } from '../pages/AdminHubPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AdminUserAccessPage } from '../pages/AdminUserAccessPage';
import { AdminRolesPage } from '../pages/AdminRolesPage';
import { AdminAuditPage } from '../pages/AdminAuditPage';
import { AdminCertificatesPage } from '../pages/AdminCertificatesPage';
import { AdminAlertsPage } from '../pages/AdminAlertsPage';
import { AdminEpdTariffPage } from '../pages/AdminEpdTariffPage';
import { AdminSecurityPage } from '../pages/AdminSecurityPage';
import { WorkspacesPage } from '../pages/WorkspacesPage';
import { LoginPage } from '../pages/LoginPage';
import { TwoFactorPage } from '../pages/TwoFactorPage';
import { SessionExpiredPage, AccessDeniedPage, NotFoundPage } from '../pages/SystemStatePages';

export const router = createBrowserRouter([
  { path:'login', element:<LoginPage/> },
  { path:'auth/2fa', element:<TwoFactorPage/> },
  { path:'auth/session-expired', element:<SessionExpiredPage/> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'trips', element: <TripsPage /> },
      { path: 'trips/new', element: <TripNewPage /> },
      { path: 'trips/:tripId', element: <TripDetailsPage /> },
      { path: 'fuel', element: <FuelPage /> },
      { path: 'fuel/new', element: <FuelNewPage /> },
      { path: 'fuel/anomalies', element: <FuelAnomaliesPage /> },
      { path: 'fuel/approvals', element: <FuelApprovalsPage /> },
      { path: 'fuel/:fuelingId', element: <FuelDetailsPage /> },
      { path: 'epd', element: <EpdPage /> },
      { path: 'epd/new', element: <EpdNewPage /> },
      { path: 'epd/:documentId', element: <EplDetailsPage /> },
      { path: 'edo', element: <EdoPage /> },
      { path: 'edo/new', element: <EdoNewPage /> },
      { path: 'edo/reconciliation', element: <EdoReconciliationPage /> },
      { path: 'edo/:documentId', element: <EdoDetailsPage /> },
      { path: 'reports', element: <ReportsHubPage /> },
      { path: 'reports/drivers', element: <DriversReportPage /> },
      { path: 'reports/fuel', element: <FuelReportPage /> },
      { path: 'reports/trips', element: <TripsReportPage /> },
      { path: 'reports/epd', element: <EpdReportPage /> },
      { path: 'reports/edo', element: <EdoReportPage /> },
      { path: 'reports/finance', element: <FinanceReportPage /> },
      { path: 'directories', element: <DirectoriesPage /> },
      { path: 'directories/gas-stations/:stationId', element: <GasStationDetailsPage /> },
      { path: 'directories/fuel-norms/:normId', element: <FuelNormDetailsPage /> },
      { path: 'directories/:directoryId', element: <DirectoryRegistryPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'integrations', element: <IntegrationsPage /> },
      { path: 'integrations/jobs', element: <IntegrationJobsPage /> },
      { path: 'integrations/:integrationId', element: <IntegrationDetailsPage /> },
      { path: 'driver', element: <DriverHomePage /> },
      { path: 'driver/trips', element: <DriverTripsPage /> },
      { path: 'driver/trips/:tripId', element: <DriverTripDetailsPage /> },
      { path: 'driver/documents', element: <DriverDocumentsPage /> },
      { path: 'driver/fuel/new', element: <DriverFuelNewPage /> },
      { path: 'workspace', element: <WorkspacesPage /> },
      { path: 'mechanic', element: <MechanicHomePage /> },
      { path: 'mechanic/vehicles', element: <DirectoryRegistryPage /> },
      { path: 'mechanic/fuel', element: <FuelPage /> },
      { path: 'mechanic/technical-control/:inspectionId', element: <MechanicInspectionPage /> },
      { path: 'medical', element: <MedicalHomePage /> },
      { path: 'medical/documents', element: <MedicalDocumentsPage /> },
      { path: 'medical/epl/:documentId', element: <MedicalCheckPage /> },
      { path: 'admin', element: <AdminHubPage /> },
      { path: 'admin/users', element: <AdminUsersPage /> },
      { path: 'admin/users/:userId/access', element: <AdminUserAccessPage /> },
      { path: 'admin/roles', element: <AdminRolesPage /> },
      { path: 'admin/audit', element: <AdminAuditPage /> },
      { path: 'admin/certificates', element: <AdminCertificatesPage /> },
      { path: 'admin/alerts', element: <AdminAlertsPage /> },
      { path: 'admin/epd-tariff', element: <AdminEpdTariffPage /> },
      { path: 'admin/security', element: <AdminSecurityPage /> },
      { path: '403', element: <AccessDeniedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
