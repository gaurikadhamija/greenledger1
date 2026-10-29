export type EvidenceStatus = 'documented' | 'calculated' | 'estimated' | 'unverified' | 'flagged';

export type ReviewFlagSeverity = 'critical' | 'warning' | 'info';

export type ReviewFlagStatus = 'pending' | 'reviewed' | 'resolved';

export interface CampusCoordinates {
  lat: number;
  lng: number;
}

export interface Campus {
  id: string;
  name: string;
  abbreviation: string;
  shortName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: CampusCoordinates;
  establishedYear: number;
  campusAreaAcres: number;
  discom: string; // e.g., TPDDL, BRPL, BYPL
  consumerCaPrefix: string;
  description: string;
  website: string;
  totalBuildingsCount?: number;
  auditsCount?: number;
  evidenceCount?: number;
  latestPeriod?: string | null;
  totalKwh?: number | null;
  totalCostInr?: number | null;
  evidenceCoveragePercent?: number | null;
  activeFlagsCount?: number;
}

export interface Audit {
  id: string;
  campusId: string;
  periodName: string; // e.g. "FY 2024-25" or "CY 2025"
  reportingYear: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'draft' | 'in_progress' | 'verified' | 'assurance_ready';
  totalKwh: number;
  totalCostInr: number;
  verifiedBillsCount: number;
  totalBillsCount: number;
  evidenceCoveragePercent: number;
  activeFlagsCount: number;
  emissionsTonsCo2e: number;
  emissionFactorKgPerKwh: number;
  emissionFactorSource: string;
  createdAt: string;
  updatedAt: string;
}

export interface UtilityBill {
  id: string;
  campusId: string;
  auditId?: string;
  invoiceNumber: string;
  utilityProvider: string; // Delhi DISCOM: BSES Rajdhani (BRPL), BSES Yamuna (BYPL), Tata Power DDL (TPDDL)
  accountNumber: string; // CA Number
  siteName: string; // Specific campus facility/substation
  serviceAddress: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysInPeriod: number;
  consumptionKwh: number;
  peakDemandKw?: number;
  totalCostInr: number;
  ratePerKwh: number; // in INR / kWh
  currency: 'INR';
  documentFileName: string;
  documentFileSize: string;
  uploadDate: string;
  verificationStatus: 'unverified' | 'user_verified' | 'disputed';
  verifiedBy?: string;
  verifiedAt?: string;
  evidenceStatus: EvidenceStatus;
  notes?: string;
  ocrConfidence?: number; // 0 to 1
  hashSha256?: string;
}

export interface ReviewFlag {
  id: string;
  campusId: string;
  auditId?: string;
  billId?: string;
  invoiceNumber?: string;
  type: 'overlapping_period' | 'missing_field' | 'duplicate_record' | 'unusual_spike' | 'unverified_document' | 'tariff_disconnect';
  title: string;
  description: string;
  severity: ReviewFlagSeverity;
  status: ReviewFlagStatus;
  reviewerNotes?: string;
  detectedAt: string;
  resolvedAt?: string;
}

export interface AuditComparison {
  campusName: string;
  baselinePeriod: {
    name: string;
    startDate: string;
    endDate: string;
    totalKwh: number;
    totalCostInr: number;
    days: number;
    avgDailyKwh: number;
    avgRatePerKwh: number;
  };
  comparisonPeriod: {
    name: string;
    startDate: string;
    endDate: string;
    totalKwh: number;
    totalCostInr: number;
    days: number;
    avgDailyKwh: number;
    avgRatePerKwh: number;
  };
  kwhDelta: number;
  kwhDeltaPercent: number;
  costDelta: number;
  costDeltaPercent: number;
  dailyKwhDelta: number;
  dailyKwhDeltaPercent: number;
  emissionsBaselineTonsCo2e: number;
  emissionsComparisonTonsCo2e: number;
  emissionsDeltaTonsCo2e: number;
  evidenceCoveragePercent: number;
  emissionFactorKgPerKwh: number;
  emissionFactorSource: string;
  comparabilityWarning?: string;
}

export interface GreenScorecardData {
  institutionName: string;
  campusAbbr: string;
  campusId: string;
  facilityScope: string;
  reportingPeriod: string;
  baselinePeriod: string;
  generationDate: string;
  auditorOrganization: string;
  evidenceCoveragePercent: number;
  verifiedBillsCount: number;
  totalBillsCount: number;
  kwhCurrent: number;
  kwhBaseline: number;
  kwhDeltaPercent: number;
  costCurrent: number; // in INR
  costBaseline: number; // in INR
  costDeltaPercent: number;
  avgDailyKwhCurrent: number;
  avgDailyKwhBaseline: number;
  emissionsCurrentTonsCo2e: number;
  emissionsBaselineTonsCo2e: number;
  emissionsDeltaTonsCo2e: number;
  emissionFactor: {
    factorKgPerKwh: number;
    source: string;
    status: EvidenceStatus;
  };
  activeReviewFlagsCount: number;
  resolvedReviewFlagsCount: number;
  recommendedActions: {
    priority: 'Immediate' | 'Medium-term' | 'Strategic';
    title: string;
    description: string;
  }[];
  assumptionsAndLimitations: string[];
}

export interface CampusSummary {
  campus: Campus;
  audits: Audit[];
  bills: UtilityBill[];
  flags: ReviewFlag[];
  totalKwh: number;
  totalCostInr: number;
  coveragePercent: number;
  hasAudits: boolean;
}
