import { Campus, Audit, UtilityBill, ReviewFlag, CampusSummary } from '../types';
import { DELHI_CAMPUSES } from '../data/delhiCampuses';

export interface DashboardStats {
  registeredCampusesCount: number;
  campuses: { id: string; name: string; abbr: string }[];
  totalAuditsCount: number;
  totalBillsCount: number;
  verifiedBillsCount: number;
  pendingVerificationCount: number;
  totalKwhVerified: number;
  totalCostInrVerified: number;
  activeFlagsCount: number;
  nationalGridEmissionFactor: number;
  currency: string;
  timezone: string;
}

const API_BASE = '/api';

/**
 * Safe fetch wrapper with JSON parsing and fallback error handling
 */
async function fetchJson<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errBody.error || `HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (fallback !== undefined) {
      console.warn(`[API] Fallback used for ${url}:`, err);
      return fallback;
    }
    throw err;
  }
}

export const api = {
  // Campuses
  async getCampuses(): Promise<Campus[]> {
    return fetchJson<Campus[]>(`${API_BASE}/campuses`, undefined, DELHI_CAMPUSES);
  },

  async getCampus(id: string): Promise<Campus> {
    const fallback = DELHI_CAMPUSES.find((c) => c.id === id) || DELHI_CAMPUSES[0];
    return fetchJson<Campus>(`${API_BASE}/campuses/${id}`, undefined, fallback);
  },

  async getCampusSummary(id: string): Promise<CampusSummary> {
    const defaultCampus = DELHI_CAMPUSES.find((c) => c.id === id) || DELHI_CAMPUSES[0];
    const fallback: CampusSummary = {
      campus: defaultCampus,
      audits: [],
      bills: [],
      flags: [],
      totalKwh: 0,
      totalCostInr: 0,
      coveragePercent: 0,
      hasAudits: false,
    };
    return fetchJson<CampusSummary>(`${API_BASE}/campuses/${id}/summary`, undefined, fallback);
  },

  async getCampusAudits(campusId: string): Promise<Audit[]> {
    return fetchJson<Audit[]>(`${API_BASE}/campuses/${campusId}/audits`, undefined, []);
  },

  async createCampusAudit(campusId: string, data: Partial<Audit>): Promise<Audit> {
    return fetchJson<Audit>(`${API_BASE}/campuses/${campusId}/audits`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCampusesComparison(): Promise<any[]> {
    return fetchJson<any[]>(`${API_BASE}/campuses/compare`, undefined, []);
  },

  // Audits
  async getAudits(campusId?: string): Promise<Audit[]> {
    const query = campusId ? `?campusId=${encodeURIComponent(campusId)}` : '';
    return fetchJson<Audit[]>(`${API_BASE}/audits${query}`, undefined, []);
  },

  async createAudit(data: Partial<Audit>): Promise<Audit> {
    return fetchJson<Audit>(`${API_BASE}/audits`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Utility Bills
  async getBills(campusId?: string, auditId?: string): Promise<UtilityBill[]> {
    const params = new URLSearchParams();
    if (campusId) params.append('campusId', campusId);
    if (auditId) params.append('auditId', auditId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<UtilityBill[]>(`${API_BASE}/bills${qs}`, undefined, []);
  },

  async createBill(billData: Partial<UtilityBill>): Promise<UtilityBill> {
    return fetchJson<UtilityBill>(`${API_BASE}/bills`, {
      method: 'POST',
      body: JSON.stringify(billData),
    });
  },

  async updateBill(id: string, updates: Partial<UtilityBill>): Promise<UtilityBill> {
    return fetchJson<UtilityBill>(`${API_BASE}/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteBill(id: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`${API_BASE}/bills/${id}`, {
      method: 'DELETE',
    });
  },

  // Review Flags
  async getFlags(campusId?: string): Promise<ReviewFlag[]> {
    const qs = campusId ? `?campusId=${encodeURIComponent(campusId)}` : '';
    return fetchJson<ReviewFlag[]>(`${API_BASE}/flags${qs}`, undefined, []);
  },

  async updateFlag(id: string, updates: Partial<ReviewFlag>): Promise<ReviewFlag> {
    return fetchJson<ReviewFlag>(`${API_BASE}/flags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Evidence Upload OCR
  async uploadEvidence(campusId: string, fileName?: string): Promise<{ success: boolean; extractedBill: UtilityBill; message: string }> {
    return fetchJson<{ success: boolean; extractedBill: UtilityBill; message: string }>(`${API_BASE}/evidence/upload`, {
      method: 'POST',
      body: JSON.stringify({ campusId, fileName }),
    });
  },

  // Dashboard Aggregates
  async getDashboardStats(): Promise<DashboardStats> {
    const fallback: DashboardStats = {
      registeredCampusesCount: 5,
      campuses: DELHI_CAMPUSES.map((c) => ({ id: c.id, name: c.name, abbr: c.abbreviation })),
      totalAuditsCount: 0,
      totalBillsCount: 0,
      verifiedBillsCount: 0,
      pendingVerificationCount: 0,
      totalKwhVerified: 0,
      totalCostInrVerified: 0,
      activeFlagsCount: 0,
      nationalGridEmissionFactor: 0.716,
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    };
    return fetchJson<DashboardStats>(`${API_BASE}/dashboard/stats`, undefined, fallback);
  },

  // Seed sample audit for immediate testing
  async seedSampleAudit(campusId: string): Promise<{ success: boolean; audit: Audit; billsCount: number }> {
    return fetchJson<{ success: boolean; audit: Audit; billsCount: number }>(`${API_BASE}/campuses/${campusId}/seed-sample-audit`, {
      method: 'POST',
    });
  },

  // Reset database to initial 5 campuses with 0 audits
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE}/database/reset`, {
      method: 'POST',
    });
  },
};
