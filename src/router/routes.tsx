import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ROUTES } from '@/config/routes';

// Lazy loaded pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'));
const PendingApprovalPage = lazy(() => import('@/features/auth/pages/PendingApprovalPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const ProfilePage = lazy(() => import('@/features/auth/pages/ProfilePage'));
const EudrDashboard = lazy(() => import('@/features/shared/eudr/pages/EudrDashboard'));
const EudrLibrary = lazy(() => import('@/features/shared/eudr/pages/EudrLibrary'));
const EudrArticleViewer = lazy(() => import('@/features/shared/eudr/pages/EudrArticleViewer'));
const CertificationDashboard = lazy(() => import('@/features/shared/certification/pages/CertificationDashboard'));
const CertificationLibrary = lazy(() => import('@/features/shared/certification/pages/CertificationLibrary'));
const CertificationArticleViewer = lazy(() => import('@/features/shared/certification/pages/CertificationArticleViewer'));
const EudrAssessmentPage = lazy(() => import('@/features/shared/eudr/pages/EudrAssessmentForm'));
const CooperativeManagement = lazy(() => import('@/features/shared/cooperative/pages/CooperativeManagement'));
const FarmOperationsPage = lazy(() => import('@/features/shared/farm-operations/pages/FarmOperationsPage'));
const DoNoHarmPage = lazy(() => import('@/features/shared/do-no-harm/pages/DoNoHarmPage'));
const GHGCollectionPage = lazy(() => import('@/features/shared/ghg-collection/pages/GHGCollectionPage'));

// System pages
const SettingsPage = lazy(() => import('@/features/system/pages/SettingsPage'));
const UserManagement = lazy(() => import('@/features/system/pages/UserManagement'));
const LanguageCustomization = lazy(() => import('@/features/system/pages/LanguageCustomization'));
const StaffManagement = lazy(() => import('@/features/shared/staff/pages/StaffManagement'));
const BatchQRPrint = lazy(() => import('@/features/shared/certification/pages/BatchQRPrint'));
const QRIntakeVerification = lazy(() => import('@/features/shared/certification/pages/QRIntakeVerification'));
const RoleManagement = lazy(() => import('@/features/system/pages/RoleManagement'));
const GlobalMapPage = lazy(() => import('@/features/shared/map/pages/GlobalMapPage'));

const CertificationAuditList = lazy(() => import('@/features/shared/certification/pages/CertificationAuditList'));
const FarmerProfilePage = lazy(() => import('@/features/shared/cooperative/pages/FarmerProfilePage'));
const FarmerFormPage = lazy(() => import('@/features/shared/cooperative/pages/FarmerFormPage'));
const FarmFormPage = lazy(() => import('@/features/shared/cooperative/pages/FarmFormPage'));

// Country & Region hub pages
const RegionHub = lazy(() => import('@/features/region/pages/RegionHub'));
const LaosHub = lazy(() => import('@/features/laos/pages/LaosHub'));
const VietnamHub = lazy(() => import('@/features/vietnam/pages/VietnamHub'));
const IndonesiaHub = lazy(() => import('@/features/indonesia/pages/IndonesiaHub'));

// Module hub pages (cooperative, slow farm, warehouse)
const CooperativeHub = lazy(() => import('@/features/shared/cooperative/pages/CooperativeHub'));
const SlowFarmHub = lazy(() => import('@/features/shared/slow-farm/pages/SlowFarmHub'));
const WarehouseHub = lazy(() => import('@/features/shared/warehouse/pages/WarehouseHub'));

// Standalone module hubs (cross-country shortcuts)
const ModulesHub = lazy(() => import('@/features/modules/pages/ModulesHub'));
const WarehouseModuleHub = lazy(() => import('@/features/modules/pages/WarehouseModuleHub'));
const CertificateModuleHub = lazy(() => import('@/features/modules/pages/CertificateModuleHub'));

// Warehouse data table pages
const LogbookTab = lazy(() => import('@/features/shared/warehouse/components/LogbookTab'));
const InboundTab = lazy(() => import('@/features/shared/warehouse/components/InboundTab'));
const OutboundRequestList = lazy(() => import('@/features/shared/warehouse/pages/OutboundRequestList'));
const SupplierList = lazy(() => import('@/features/shared/warehouse/pages/SupplierList'));
const WarehouseLookupList = lazy(() => import('@/features/shared/warehouse/pages/WarehouseLookupList'));

// Laos Daycare pages
const DaycareHub = lazy(() => import('@/features/laos/daycare/pages/DaycareHub'));
const DcFamilyList = lazy(() => import('@/features/laos/daycare/pages/DcFamilyList'));
const DcKidList = lazy(() => import('@/features/laos/daycare/pages/DcKidList'));
const DcKidStudyList = lazy(() => import('@/features/laos/daycare/pages/DcKidStudyList'));
const DcAttendanceList = lazy(() => import('@/features/laos/daycare/pages/DcAttendanceList'));
const DcHealthCheckList = lazy(() => import('@/features/laos/daycare/pages/DcHealthCheckList'));
const DcFarmHealthCheckList = lazy(() => import('@/features/laos/daycare/pages/DcFarmHealthCheckList'));
const DcAttendanceCheckList = lazy(() => import('@/features/laos/daycare/pages/DcAttendanceCheckList'));
const DcMenuDetailList = lazy(() => import('@/features/laos/daycare/pages/DcMenuDetailList'));
const DcMaterialList = lazy(() => import('@/features/laos/daycare/pages/DcMaterialList'));

// Indonesia Cocoa pages
const CocoaHub = lazy(() => import('@/features/indonesia/cocoa/pages/CocoaHub'));
const IdFarmerGroupList = lazy(() => import('@/features/indonesia/cocoa/pages/IdFarmerGroupList'));
const IdCocoaBatchList = lazy(() => import('@/features/indonesia/cocoa/pages/IdCocoaBatchList'));
const IdCocoaBatchLogList = lazy(() => import('@/features/indonesia/cocoa/pages/IdCocoaBatchLogList'));
const IdCocoaBatchDetailList = lazy(() => import('@/features/indonesia/cocoa/pages/IdCocoaBatchDetailList'));
const IdCocoaPriceList = lazy(() => import('@/features/indonesia/cocoa/pages/IdCocoaPriceList'));
const IdCocoaRecapList = lazy(() => import('@/features/indonesia/cocoa/pages/IdCocoaRecapList'));
const IdFarmerContractList = lazy(() => import('@/features/indonesia/cocoa/pages/IdFarmerContractList'));

// Indonesia RA Audit pages
const RaAuditHub = lazy(() => import('@/features/indonesia/ra-audit/pages/RaAuditHub'));
const RaFarmerInspectionList = lazy(() => import('@/features/indonesia/ra-audit/pages/RaFarmerInspectionList'));
const RaFarmInspectionList = lazy(() => import('@/features/indonesia/ra-audit/pages/RaFarmInspectionList'));
const RaSpeciesIndexList = lazy(() => import('@/features/indonesia/ra-audit/pages/RaSpeciesIndexList'));
const RaTreeIndexList = lazy(() => import('@/features/indonesia/ra-audit/pages/RaTreeIndexList'));
const RaFamilyDataList = lazy(() => import('@/features/indonesia/ra-audit/pages/RaFamilyDataList'));
const RaCertificateList = lazy(() => import('@/features/indonesia/ra-audit/pages/RaCertificateList'));

// Impact Implementation pages
const ImpactImplementationHub = lazy(() => import('@/features/shared/impact/pages/ImpactImplementationHub'));
const ActImpactList = lazy(() => import('@/features/shared/impact/pages/ActImpactList'));
const ActImpactDetailList = lazy(() => import('@/features/shared/impact/pages/ActImpactDetailList'));
const ImpactPlanList = lazy(() => import('@/features/shared/impact/pages/ImpactPlanList'));
const ImpactPlanDetailList = lazy(() => import('@/features/shared/impact/pages/ImpactPlanDetailList'));
const ImpactActivityList = lazy(() => import('@/features/shared/impact/pages/ImpactActivityList'));

// KPI Dashboard pages
const DaycareKpiDashboard = lazy(() => import('@/features/laos/daycare/pages/DaycareKpiDashboard'));
const CocoaKpiDashboard = lazy(() => import('@/features/indonesia/cocoa/pages/CocoaKpiDashboard'));
const RaAuditKpiDashboard = lazy(() => import('@/features/indonesia/ra-audit/pages/RaAuditKpiDashboard'));

// Placeholder for pages not yet built
function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-muted-foreground">Coming Soon</h2>
      <p className="text-sm text-muted-foreground mt-1">This module is under development</p>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  // Auth routes (no sidebar)
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: ROUTES.REGISTER, element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
      { path: ROUTES.FORGOT_PASSWORD, element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper> },
      { path: ROUTES.PENDING_APPROVAL, element: <SuspenseWrapper><PendingApprovalPage /></SuspenseWrapper> },
    ],
  },

  // Protected routes (with sidebar)
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          { path: ROUTES.DASHBOARD, element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
          { path: ROUTES.PROFILE, element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper> },

          // Country & Region Hubs
          { path: ROUTES.REGION_HUB, element: <SuspenseWrapper><RegionHub /></SuspenseWrapper> },
          { path: ROUTES.LAOS_HUB, element: <SuspenseWrapper><LaosHub /></SuspenseWrapper> },
          { path: ROUTES.VIETNAM_HUB, element: <SuspenseWrapper><VietnamHub /></SuspenseWrapper> },
          { path: ROUTES.INDONESIA_HUB, element: <SuspenseWrapper><IndonesiaHub /></SuspenseWrapper> },

          // Standalone Module Shortcuts
          { path: ROUTES.MODULES_HUB, element: <SuspenseWrapper><ModulesHub /></SuspenseWrapper> },
          { path: ROUTES.MAP, element: <SuspenseWrapper><GlobalMapPage /></SuspenseWrapper> },
          { path: ROUTES.MOD_WAREHOUSE, element: <SuspenseWrapper><WarehouseModuleHub /></SuspenseWrapper> },
          { path: ROUTES.MOD_CERTIFICATE, element: <SuspenseWrapper><CertificateModuleHub /></SuspenseWrapper> },
          { path: ROUTES.MOD_COOPERATIVE, element: <Navigate to={ROUTES.LA_COOPERATIVE} replace /> },
          { path: ROUTES.MOD_SLOW_FARM, element: <Navigate to={ROUTES.LA_SLOW_FARM} replace /> },
          { path: ROUTES.MOD_DAYCARE, element: <Navigate to={ROUTES.LA_DAYCARE} replace /> },

          // Region (Impact Zone)
          { path: ROUTES.IMPACT_GHG, element: <ComingSoon /> },
          { path: ROUTES.IMPACT_EUDR, element: <SuspenseWrapper><EudrDashboard /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_CLIENT_CARBON, element: <ComingSoon /> },
          { path: ROUTES.IMPACT_CERTIFICATION, element: <SuspenseWrapper><CertificationDashboard /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_IMPL, element: <SuspenseWrapper><ImpactImplementationHub /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_ACT, element: <SuspenseWrapper><ActImpactList /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_ACT_DETAIL, element: <SuspenseWrapper><ActImpactDetailList /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_PLAN, element: <SuspenseWrapper><ImpactPlanList /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_PLAN_DETAIL, element: <SuspenseWrapper><ImpactPlanDetailList /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_ACTIVITY_REF, element: <SuspenseWrapper><ImpactActivityList /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_BUDGET, element: <ComingSoon /> },
          { path: ROUTES.IMPACT_GOALS, element: <ComingSoon /> },
          { path: ROUTES.IMPACT_KPIS, element: <ComingSoon /> },

          // System
          { path: ROUTES.IMPACT_SETTINGS, element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_USERS, element: <SuspenseWrapper><UserManagement /></SuspenseWrapper> },
          { path: ROUTES.IMPACT_LANGUAGE, element: <SuspenseWrapper><LanguageCustomization /></SuspenseWrapper> },
          { path: ROUTES.SYSTEM_ROLES, element: <SuspenseWrapper><RoleManagement /></SuspenseWrapper> },

          // Indonesia
          { path: ROUTES.ID_STAFF, element: <SuspenseWrapper><StaffManagement country="indonesia" /></SuspenseWrapper> },
          { path: ROUTES.ID_COOPERATIVE, element: <SuspenseWrapper><CooperativeHub country="indonesia" /></SuspenseWrapper> },
          { path: `${ROUTES.ID_COOPERATIVE}/data/*`, element: <SuspenseWrapper><CooperativeManagement country="indonesia" /></SuspenseWrapper> },
          { path: `${ROUTES.ID_FARM_OP}/*`, element: <SuspenseWrapper><FarmOperationsPage country="indonesia" /></SuspenseWrapper> },
          { path: `${ROUTES.ID_DO_NO_HARM}/*`, element: <SuspenseWrapper><DoNoHarmPage country="indonesia" /></SuspenseWrapper> },
          { path: ROUTES.ID_EUDR, element: <Navigate to={`${ROUTES.IMPACT_EUDR}?country=indonesia`} replace /> },
          { path: ROUTES.ID_CACAO_PRICE, element: <ComingSoon /> },
          { path: ROUTES.ID_FACILITIES, element: <ComingSoon /> },
          { path: ROUTES.ID_OFFICES, element: <ComingSoon /> },
          { path: ROUTES.ID_WAREHOUSE, element: <SuspenseWrapper><WarehouseHub country="indonesia" /></SuspenseWrapper> },
          { path: `${ROUTES.ID_WAREHOUSE}/harvesting`, element: <SuspenseWrapper><LogbookTab country="indonesia" /></SuspenseWrapper> },
          { path: `${ROUTES.ID_WAREHOUSE}/inbound`, element: <SuspenseWrapper><InboundTab country="indonesia" /></SuspenseWrapper> },
          { path: ROUTES.ID_CERTIFICATION, element: <SuspenseWrapper><CertificationDashboard country="indonesia" /></SuspenseWrapper> },

          // Indonesia Cocoa Purchase
          { path: ROUTES.ID_COCOA, element: <SuspenseWrapper><CocoaHub /></SuspenseWrapper> },
          { path: ROUTES.ID_COCOA_GROUPS, element: <SuspenseWrapper><IdFarmerGroupList /></SuspenseWrapper> },
          { path: ROUTES.ID_COCOA_BATCHES, element: <SuspenseWrapper><IdCocoaBatchList /></SuspenseWrapper> },
          { path: ROUTES.ID_COCOA_BATCH_LOGS, element: <SuspenseWrapper><IdCocoaBatchLogList /></SuspenseWrapper> },
          { path: ROUTES.ID_COCOA_BATCH_DETAILS, element: <SuspenseWrapper><IdCocoaBatchDetailList /></SuspenseWrapper> },
          { path: ROUTES.ID_COCOA_PRICES, element: <SuspenseWrapper><IdCocoaPriceList /></SuspenseWrapper> },
          { path: ROUTES.ID_COCOA_RECAPS, element: <SuspenseWrapper><IdCocoaRecapList /></SuspenseWrapper> },
          { path: ROUTES.ID_COCOA_CONTRACTS, element: <SuspenseWrapper><IdFarmerContractList /></SuspenseWrapper> },
          { path: ROUTES.ID_COCOA_KPI, element: <SuspenseWrapper><CocoaKpiDashboard /></SuspenseWrapper> },

          // Indonesia RA Audit
          { path: ROUTES.ID_RA_AUDIT, element: <SuspenseWrapper><RaAuditHub /></SuspenseWrapper> },
          { path: ROUTES.ID_RA_FARMERS, element: <SuspenseWrapper><RaFarmerInspectionList /></SuspenseWrapper> },
          { path: ROUTES.ID_RA_FARMS, element: <SuspenseWrapper><RaFarmInspectionList /></SuspenseWrapper> },
          { path: ROUTES.ID_RA_SPECIES, element: <SuspenseWrapper><RaSpeciesIndexList /></SuspenseWrapper> },
          { path: ROUTES.ID_RA_TREES, element: <SuspenseWrapper><RaTreeIndexList /></SuspenseWrapper> },
          { path: ROUTES.ID_RA_FAMILY, element: <SuspenseWrapper><RaFamilyDataList /></SuspenseWrapper> },
          { path: ROUTES.ID_RA_CERTIFICATES, element: <SuspenseWrapper><RaCertificateList /></SuspenseWrapper> },
          { path: ROUTES.ID_RA_KPI, element: <SuspenseWrapper><RaAuditKpiDashboard /></SuspenseWrapper> },

          // Vietnam
          { path: ROUTES.VN_STAFF, element: <SuspenseWrapper><StaffManagement country="vietnam" /></SuspenseWrapper> },
          { path: ROUTES.VN_COOPERATIVE, element: <SuspenseWrapper><CooperativeHub country="vietnam" /></SuspenseWrapper> },
          { path: `${ROUTES.VN_COOPERATIVE}/data/*`, element: <SuspenseWrapper><CooperativeManagement country="vietnam" /></SuspenseWrapper> },
          { path: ROUTES.VN_EUDR, element: <Navigate to={`${ROUTES.IMPACT_EUDR}?country=vietnam`} replace /> },
          { path: ROUTES.VN_COFFEE_PRICE, element: <ComingSoon /> },
          { path: ROUTES.VN_FACILITIES, element: <ComingSoon /> },
          { path: ROUTES.VN_OFFICES, element: <ComingSoon /> },
          { path: ROUTES.VN_WAREHOUSE, element: <SuspenseWrapper><WarehouseHub country="vietnam" /></SuspenseWrapper> },
          { path: `${ROUTES.VN_WAREHOUSE}/harvesting`, element: <SuspenseWrapper><LogbookTab country="vietnam" /></SuspenseWrapper> },
          { path: `${ROUTES.VN_WAREHOUSE}/inbound`, element: <SuspenseWrapper><InboundTab country="vietnam" /></SuspenseWrapper> },
          { path: ROUTES.VN_CERTIFICATION, element: <SuspenseWrapper><CertificationDashboard country="vietnam" /></SuspenseWrapper> },

          // Laos
          { path: ROUTES.LA_STAFF, element: <SuspenseWrapper><StaffManagement country="laos" /></SuspenseWrapper> },
          { path: ROUTES.LA_COOPERATIVE, element: <SuspenseWrapper><CooperativeHub country="laos" /></SuspenseWrapper> },
          { path: `${ROUTES.LA_COOPERATIVE}/data/*`, element: <SuspenseWrapper><CooperativeManagement country="laos" /></SuspenseWrapper> },
          { path: `${ROUTES.LA_FARM_OP}/*`, element: <SuspenseWrapper><FarmOperationsPage country="laos" /></SuspenseWrapper> },
          { path: `${ROUTES.LA_DO_NO_HARM}/*`, element: <SuspenseWrapper><DoNoHarmPage country="laos" /></SuspenseWrapper> },
          { path: ROUTES.LA_SLOW_FARM, element: <SuspenseWrapper><SlowFarmHub /></SuspenseWrapper> },
          { path: `${ROUTES.LA_SLOW_FARM_OP}/*`, element: <ComingSoon /> },
          { path: `${ROUTES.LA_SLOW_FARM_TREES}/*`, element: <ComingSoon /> },
          { path: `${ROUTES.LA_SLOW_FARM_WORKERS}/*`, element: <ComingSoon /> },
          { path: `${ROUTES.LA_SLOW_FARM_DNH}/*`, element: <ComingSoon /> },
          { path: ROUTES.LA_EUDR, element: <Navigate to={`${ROUTES.IMPACT_EUDR}?country=laos`} replace /> },
          { path: ROUTES.LA_COFFEE_PRICE, element: <ComingSoon /> },
          { path: ROUTES.LA_OFFICES, element: <ComingSoon /> },
          { path: ROUTES.LA_GHG, element: <SuspenseWrapper><GHGCollectionPage country="laos" /></SuspenseWrapper> },
          // Warehouse hub + data tables
          { path: ROUTES.LA_WAREHOUSE, element: <SuspenseWrapper><WarehouseHub country="laos" /></SuspenseWrapper> },
          { path: ROUTES.LA_WH_HARVESTING, element: <SuspenseWrapper><LogbookTab country="laos" /></SuspenseWrapper> },
          { path: ROUTES.LA_WH_INBOUND, element: <SuspenseWrapper><InboundTab country="laos" /></SuspenseWrapper> },
          { path: ROUTES.LA_WH_OUTBOUND, element: <SuspenseWrapper><OutboundRequestList country="laos" /></SuspenseWrapper> },
          { path: ROUTES.LA_WH_SUPPLIERS, element: <SuspenseWrapper><SupplierList /></SuspenseWrapper> },
          { path: ROUTES.LA_WH_LOOKUPS, element: <SuspenseWrapper><WarehouseLookupList /></SuspenseWrapper> },
          { path: ROUTES.LA_CERTIFICATION, element: <SuspenseWrapper><CertificationDashboard country="laos" /></SuspenseWrapper> },

          // Laos Daycare
          { path: ROUTES.LA_DAYCARE, element: <SuspenseWrapper><DaycareHub /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_FAMILIES, element: <SuspenseWrapper><DcFamilyList /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_KIDS, element: <SuspenseWrapper><DcKidList /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_STUDIES, element: <SuspenseWrapper><DcKidStudyList /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_ATTENDANCE, element: <SuspenseWrapper><DcAttendanceList /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_HEALTH, element: <SuspenseWrapper><DcHealthCheckList /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_FARM_HEALTH, element: <SuspenseWrapper><DcFarmHealthCheckList /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_ATT_CHECKS, element: <SuspenseWrapper><DcAttendanceCheckList /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_MENU, element: <SuspenseWrapper><DcMenuDetailList /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_MATERIALS, element: <SuspenseWrapper><DcMaterialList /></SuspenseWrapper> },
          { path: ROUTES.LA_DC_KPI, element: <SuspenseWrapper><DaycareKpiDashboard /></SuspenseWrapper> },

          // EUDR
          { path: ROUTES.EUDR_ASSESSMENT, element: <SuspenseWrapper><EudrAssessmentPage /></SuspenseWrapper> },
          { path: ROUTES.EUDR_LIBRARY, element: <SuspenseWrapper><EudrLibrary /></SuspenseWrapper> },
          { path: ROUTES.EUDR_ARTICLE, element: <SuspenseWrapper><EudrArticleViewer /></SuspenseWrapper> },

          // Certification Library
          { path: ROUTES.CERT_LIBRARY, element: <SuspenseWrapper><CertificationLibrary /></SuspenseWrapper> },
          { path: ROUTES.CERT_ARTICLE, element: <SuspenseWrapper><CertificationArticleViewer /></SuspenseWrapper> },
          { path: ROUTES.CERT_QR_PRINT, element: <SuspenseWrapper><BatchQRPrint /></SuspenseWrapper> },
          { path: ROUTES.CERT_QR_SCAN, element: <SuspenseWrapper><QRIntakeVerification /></SuspenseWrapper> },
          { path: ROUTES.CERT_RECORDS, element: <SuspenseWrapper><CertificationAuditList /></SuspenseWrapper> },

          // Farmer & Farm Form Pages
          { path: ROUTES.FARMER_FORM, element: <SuspenseWrapper><FarmerFormPage /></SuspenseWrapper> },
          { path: ROUTES.FARM_FORM, element: <SuspenseWrapper><FarmFormPage /></SuspenseWrapper> },

          // Farmer Profile
          { path: ROUTES.FARMER_PROFILE, element: <SuspenseWrapper><FarmerProfilePage /></SuspenseWrapper> },

          // Catch-all
          { path: '*', element: <Navigate to={ROUTES.DASHBOARD} replace /> },
        ],
      },
    ],
  },
]);
