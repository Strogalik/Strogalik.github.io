import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import type { CreateFuelingInput } from '../data/types';

export const useDashboard = () => useQuery({ queryKey: ['dashboard'], queryFn: api.dashboard });
export const useTrips = () => useQuery({ queryKey: ['trips'], queryFn: api.trips });
export const useTrip = (id: string) => useQuery({ queryKey: ['trip', id], queryFn: () => api.trip(id) });
export const useEpd = () => useQuery({ queryKey: ['epd'], queryFn: api.epd });
export const useEpdDocument = (id: string) => useQuery({ queryKey: ['epd', id], queryFn: () => api.epdDocument(id) });
export const useEdo = () => useQuery({ queryKey: ['edo'], queryFn: api.edo });
export const useEdoDocument = (id: string) => useQuery({ queryKey: ['edo', id], queryFn: () => api.edoDocument(id) });
export const useNotifications = () => useQuery({ queryKey: ['notifications'], queryFn: api.notifications });
export const useIntegrations = () => useQuery({ queryKey: ['integrations'], queryFn: api.integrations });
export const useIntegration = (id: string) => useQuery({ queryKey: ['integrations', id], queryFn: () => api.integration(id) });
export const useIntegrationJobs = () => useQuery({ queryKey: ['integration-jobs'], queryFn: api.integrationJobs });
export const useVehiclesDirectory = () => useQuery({ queryKey: ['directories', 'vehicles'], queryFn: api.vehiclesDirectory });
export const useDriversDirectory = () => useQuery({ queryKey: ['directories', 'drivers'], queryFn: api.driversDirectory });
export const useCounterpartiesDirectory = () => useQuery({ queryKey: ['directories', 'counterparties'], queryFn: api.counterpartiesDirectory });
export const useRoutesDirectory = () => useQuery({ queryKey: ['directories', 'routes'], queryFn: api.routesDirectory });
export const useGasStationsDirectory = () => useQuery({ queryKey: ['directories', 'gas-stations'], queryFn: api.gasStationsDirectory });
export const useGasStationDirectory = (id: string) => useQuery({ queryKey: ['directories', 'gas-stations', id], queryFn: () => api.gasStationDirectory(id) });
export const useFuelTypesDirectory = () => useQuery({ queryKey: ['directories', 'fuel-types'], queryFn: api.fuelTypesDirectory });
export const useFuelNormsDirectory = () => useQuery({ queryKey: ['directories', 'fuel-norms'], queryFn: api.fuelNormsDirectory });
export const useFuelNormDirectory = (id: string) => useQuery({ queryKey: ['directories', 'fuel-norms', id], queryFn: () => api.fuelNormDirectory(id) });
export const useCargoDirectory = () => useQuery({ queryKey:['directories','cargo'], queryFn:api.cargoDirectory });
export const useApprovalRoutesDirectory = () => useQuery({ queryKey:['directories','approval-routes'], queryFn:api.approvalRoutesDirectory });
export const useReasonsDirectory = () => useQuery({ queryKey:['directories','reasons'], queryFn:api.reasonsDirectory });
export const useDocumentTemplatesDirectory = () => useQuery({ queryKey:['directories','document-templates'], queryFn:api.documentTemplatesDirectory });
export const useTechnicalInspections = () => useQuery({ queryKey:['mechanic','technical-control'], queryFn:api.technicalInspections });
export const useTechnicalInspection = (id:string) => useQuery({ queryKey:['mechanic','technical-control',id], queryFn:()=>api.technicalInspection(id) });
export const useMedicalChecks = () => useQuery({ queryKey:['medical','checks'], queryFn:api.medicalChecks });
export const useMedicalCheck = (id:string) => useQuery({ queryKey:['medical','checks',id], queryFn:()=>api.medicalCheck(id) });
export const useAdminUsers = () => useQuery({ queryKey:['admin','users'], queryFn:api.adminUsers });
export const useAdminUser = (id:string) => useQuery({ queryKey:['admin','users',id], queryFn:()=>api.adminUser(id) });
export const useAdminRoles = () => useQuery({ queryKey:['admin','roles'], queryFn:api.adminRoles });
export const useAuditEvents = () => useQuery({ queryKey:['admin','audit'], queryFn:api.auditEvents });
export const useCertificates = () => useQuery({ queryKey:['admin','certificates'], queryFn:api.certificates });
export const useAlertRules = () => useQuery({ queryKey:['admin','alerts'], queryFn:api.alertRules });
export const useEpdTariff = () => useQuery({ queryKey:['admin','epd-tariff'], queryFn:api.epdTariff });

export const useDriverProfile = () => useQuery({ queryKey: ['driver', 'profile'], queryFn: api.driverProfile });
export const useDriverTrips = () => useQuery({ queryKey: ['driver', 'trips'], queryFn: api.driverTrips });
export const useDriverTrip = (id: string) => useQuery({ queryKey: ['driver', 'trips', id], queryFn: () => api.driverTrip(id) });
export const useDriverDocuments = () => useQuery({ queryKey: ['driver', 'documents'], queryFn: api.driverDocuments });
export const useDriverFuelings = () => useQuery({ queryKey: ['driver', 'fuelings'], queryFn: api.driverFuelings });

export const useFuelings = () => useQuery({ queryKey: ['fuelings'], queryFn: api.fuelings });
export const useFueling = (id: string) => useQuery({ queryKey: ['fueling', id], queryFn: () => api.fueling(id) });
export const useDriversReport = () => useQuery({ queryKey: ['reports', 'drivers'], queryFn: api.driversReport });
export const useFuelReport = () => useQuery({ queryKey: ['reports', 'fuel'], queryFn: api.fuelReport });

export function useCreateFueling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFuelingInput) => api.createFueling(input),
    onSuccess: async (item) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey:['fuelings'] }),
        queryClient.invalidateQueries({ queryKey:['reports','fuel'] }),
        queryClient.invalidateQueries({ queryKey:['fueling', item.id] }),
      ]);
    },
  });
}

export function useApproveFueling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.approveFueling(id),
    onSuccess: async (item) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey:['fuelings'] }),
        queryClient.invalidateQueries({ queryKey:['fueling', item.id] }),
        queryClient.invalidateQueries({ queryKey:['reports','fuel'] }),
      ]);
    },
  });
}

export function useRejectFueling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.rejectFueling(id),
    onSuccess: async (item) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey:['fuelings'] }),
        queryClient.invalidateQueries({ queryKey:['fueling', item.id] }),
        queryClient.invalidateQueries({ queryKey:['reports','fuel'] }),
      ]);
    },
  });
}

export const useFinanceReport = () => useQuery({ queryKey: ['reports', 'finance'], queryFn: api.financeReport });
export const useTripsReport = () => useQuery({ queryKey: ['reports', 'trips'], queryFn: api.tripsReport });
export const useEpdReport = () => useQuery({ queryKey: ['reports', 'epd'], queryFn: api.epdReport });
export const useEdoReport = () => useQuery({ queryKey: ['reports', 'edo'], queryFn: api.edoReport });
