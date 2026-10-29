import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { Campus, Audit, UtilityBill, ReviewFlag } from './src/types';
import { DELHI_CAMPUSES, INDIA_EMISSION_FACTORS } from './src/data/delhiCampuses';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Interface for persistent store
interface DatabaseSchema {
  campuses: Campus[];
  audits: Audit[];
  bills: UtilityBill[];
  flags: ReviewFlag[];
}

// Ensure database file exists with idempotent seed
function getInitialDatabase(): DatabaseSchema {
  return {
    campuses: DELHI_CAMPUSES,
    audits: [],
    bills: [],
    flags: [],
  };
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;

    // Idempotent merge: ensure all 5 Delhi campuses exist
    let modified = false;
    DELHI_CAMPUSES.forEach((dc) => {
      const idx = parsed.campuses.findIndex((c) => c.id === dc.id);
      if (idx === -1) {
        parsed.campuses.push(dc);
        modified = true;
      } else {
        // Refresh verified coordinates, addresses & metadata
        parsed.campuses[idx] = { ...parsed.campuses[idx], ...dc };
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database file, using in-memory fallback:', err);
    return getInitialDatabase();
  }
}

function saveDatabase(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database file:', err);
  }
}

let db = loadDatabase();

/**
 * Computes live metrics for a campus from stored bills and audits
 */
function enrichCampusStats(campus: Campus): Campus {
  const campusBills = db.bills.filter((b) => b.campusId === campus.id);
  const campusAudits = db.audits.filter((a) => a.campusId === campus.id);
  const campusFlags = db.flags.filter((f) => f.campusId === campus.id && f.status === 'pending');

  const verifiedBills = campusBills.filter((b) => b.verificationStatus === 'user_verified');
  const totalKwh = verifiedBills.reduce((acc, b) => acc + (b.consumptionKwh || 0), 0);
  const totalCostInr = verifiedBills.reduce((acc, b) => acc + (b.totalCostInr || 0), 0);

  const coverage = campusBills.length > 0
    ? Math.round((verifiedBills.length / campusBills.length) * 1000) / 10
    : null;

  const latestAudit = campusAudits.length > 0
    ? campusAudits[campusAudits.length - 1]
    : null;

  return {
    ...campus,
    auditsCount: campusAudits.length,
    evidenceCount: campusBills.length,
    latestPeriod: latestAudit ? latestAudit.periodName : (campusBills.length > 0 ? 'Active Evidence Cycle' : null),
    totalKwh: campusBills.length > 0 ? totalKwh : null,
    totalCostInr: campusBills.length > 0 ? totalCostInr : null,
    evidenceCoveragePercent: coverage,
    activeFlagsCount: campusFlags.length,
  };
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ==========================================
  // BACKEND API ROUTES
  // ==========================================

  // 1. GET /api/campuses - All 5 Delhi campuses with live computed statistics
  app.get('/api/campuses', (_req: Request, res: Response) => {
    const enriched = db.campuses.map(enrichCampusStats);
    res.json(enriched);
  });

  // 2. GET /api/campuses/compare - Cross-campus analytics comparison
  app.get('/api/campuses/compare', (_req: Request, res: Response) => {
    const comparisons = db.campuses.map((c) => {
      const enriched = enrichCampusStats(c);
      const bills = db.bills.filter((b) => b.campusId === c.id);
      return {
        id: c.id,
        name: c.name,
        abbreviation: c.abbreviation,
        campusAreaAcres: c.campusAreaAcres,
        discom: c.discom,
        auditsCount: enriched.auditsCount || 0,
        evidenceCount: enriched.evidenceCount || 0,
        totalKwh: enriched.totalKwh || 0,
        totalCostInr: enriched.totalCostInr || 0,
        coveragePercent: enriched.evidenceCoveragePercent || 0,
        hasAudits: (enriched.auditsCount || 0) > 0 || bills.length > 0,
      };
    });
    res.json(comparisons);
  });

  // 3. GET /api/campuses/:id - Specific campus detail
  app.get('/api/campuses/:id', (req: Request, res: Response) => {
    const campus = db.campuses.find((c) => c.id === req.params.id);
    if (!campus) {
      return res.status(404).json({ error: 'Campus not found in Delhi directory' });
    }
    res.json(enrichCampusStats(campus));
  });

  // 4. GET /api/campuses/:id/summary - Comprehensive campus summary
  app.get('/api/campuses/:id/summary', (req: Request, res: Response) => {
    const campus = db.campuses.find((c) => c.id === req.params.id);
    if (!campus) {
      return res.status(404).json({ error: 'Campus not found' });
    }
    const enriched = enrichCampusStats(campus);
    const audits = db.audits.filter((a) => a.campusId === campus.id);
    const bills = db.bills.filter((b) => b.campusId === campus.id);
    const flags = db.flags.filter((f) => f.campusId === campus.id);

    res.json({
      campus: enriched,
      audits,
      bills,
      flags,
      totalKwh: enriched.totalKwh || 0,
      totalCostInr: enriched.totalCostInr || 0,
      coveragePercent: enriched.evidenceCoveragePercent || 0,
      hasAudits: audits.length > 0 || bills.length > 0,
    });
  });

  // 5. GET /api/campuses/:id/audits - Audits for specific campus
  app.get('/api/campuses/:id/audits', (req: Request, res: Response) => {
    const audits = db.audits.filter((a) => a.campusId === req.params.id);
    res.json(audits);
  });

  // 6. POST /api/campuses/:id/audits - Create new audit for campus
  app.post('/api/campuses/:id/audits', (req: Request, res: Response) => {
    const campus = db.campuses.find((c) => c.id === req.params.id);
    if (!campus) {
      return res.status(404).json({ error: 'Campus not found' });
    }

    const { periodName, reportingYear, startDate, endDate } = req.body;
    if (!periodName || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required audit fields: periodName, startDate, endDate' });
    }

    const newAudit: Audit = {
      id: `audit-${campus.id}-${Date.now()}`,
      campusId: campus.id,
      periodName,
      reportingYear: parseInt(reportingYear, 10) || new Date().getFullYear(),
      startDate,
      endDate,
      status: 'draft',
      totalKwh: 0,
      totalCostInr: 0,
      verifiedBillsCount: 0,
      totalBillsCount: 0,
      evidenceCoveragePercent: 0,
      activeFlagsCount: 0,
      emissionsTonsCo2e: 0,
      emissionFactorKgPerKwh: INDIA_EMISSION_FACTORS[0].factorKgPerKwh,
      emissionFactorSource: INDIA_EMISSION_FACTORS[0].name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.audits.push(newAudit);
    saveDatabase(db);
    res.status(201).json(newAudit);
  });

  // 7. GET /api/audits - List all audits with optional campusId filter
  app.get('/api/audits', (req: Request, res: Response) => {
    const campusId = req.query.campusId as string;
    if (campusId) {
      return res.json(db.audits.filter((a) => a.campusId === campusId));
    }
    res.json(db.audits);
  });

  // 8. POST /api/audits - Create audit
  app.post('/api/audits', (req: Request, res: Response) => {
    const { campusId, periodName, reportingYear, startDate, endDate } = req.body;
    if (!campusId || !periodName) {
      return res.status(400).json({ error: 'campusId and periodName are required' });
    }
    const newAudit: Audit = {
      id: `audit-${campusId}-${Date.now()}`,
      campusId,
      periodName,
      reportingYear: parseInt(reportingYear, 10) || new Date().getFullYear(),
      startDate: startDate || '2025-04-01',
      endDate: endDate || '2026-03-31',
      status: 'draft',
      totalKwh: 0,
      totalCostInr: 0,
      verifiedBillsCount: 0,
      totalBillsCount: 0,
      evidenceCoveragePercent: 0,
      activeFlagsCount: 0,
      emissionsTonsCo2e: 0,
      emissionFactorKgPerKwh: INDIA_EMISSION_FACTORS[0].factorKgPerKwh,
      emissionFactorSource: INDIA_EMISSION_FACTORS[0].name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.audits.push(newAudit);
    saveDatabase(db);
    res.status(201).json(newAudit);
  });

  // 9. GET /api/bills - List utility bills with campusId/auditId filters
  app.get('/api/bills', (req: Request, res: Response) => {
    let bills = db.bills;
    if (req.query.campusId) {
      bills = bills.filter((b) => b.campusId === req.query.campusId);
    }
    if (req.query.auditId) {
      bills = bills.filter((b) => b.auditId === req.query.auditId);
    }
    res.json(bills);
  });

  // 10. POST /api/bills - Record a new utility bill
  app.post('/api/bills', (req: Request, res: Response) => {
    const {
      campusId,
      auditId,
      invoiceNumber,
      utilityProvider,
      accountNumber,
      siteName,
      serviceAddress,
      startDate,
      endDate,
      daysInPeriod,
      consumptionKwh,
      peakDemandKw,
      totalCostInr,
      ratePerKwh,
      documentFileName,
      notes,
    } = req.body;

    if (!campusId || !invoiceNumber || !consumptionKwh || !totalCostInr) {
      return res.status(400).json({ error: 'Missing mandatory fields: campusId, invoiceNumber, consumptionKwh, totalCostInr' });
    }

    const calculatedDays = daysInPeriod || Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
    const calculatedRate = ratePerKwh || (consumptionKwh > 0 ? totalCostInr / consumptionKwh : 0);

    const newBill: UtilityBill = {
      id: `bill-${campusId}-${Date.now()}`,
      campusId,
      auditId,
      invoiceNumber,
      utilityProvider: utilityProvider || 'Delhi DISCOM',
      accountNumber: accountNumber || 'CA-PENDING',
      siteName: siteName || 'Campus Main Substation',
      serviceAddress: serviceAddress || 'Campus Premises, Delhi',
      startDate,
      endDate,
      daysInPeriod: calculatedDays,
      consumptionKwh: Number(consumptionKwh),
      peakDemandKw: peakDemandKw ? Number(peakDemandKw) : undefined,
      totalCostInr: Number(totalCostInr),
      ratePerKwh: Math.round(calculatedRate * 100) / 100,
      currency: 'INR',
      documentFileName: documentFileName || 'Delhi_DISCOM_Invoice.pdf',
      documentFileSize: '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'user_verified',
      verifiedBy: 'Campus Energy Auditor',
      verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      evidenceStatus: 'documented',
      notes,
      ocrConfidence: 0.98,
    };

    db.bills.push(newBill);
    saveDatabase(db);
    res.status(201).json(newBill);
  });

  // 11. PUT /api/bills/:id - Update or verify an existing bill
  app.put('/api/bills/:id', (req: Request, res: Response) => {
    const idx = db.bills.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Bill record not found' });
    }

    db.bills[idx] = {
      ...db.bills[idx],
      ...req.body,
      id: db.bills[idx].id, // Prevent ID overwrite
    };
    saveDatabase(db);
    res.json(db.bills[idx]);
  });

  // 12. DELETE /api/bills/:id - Remove bill
  app.delete('/api/bills/:id', (req: Request, res: Response) => {
    const idx = db.bills.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    const removed = db.bills.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ success: true, removedBillId: removed.id });
  });

  // 13. GET /api/flags - Review flags
  app.get('/api/flags', (req: Request, res: Response) => {
    const campusId = req.query.campusId as string;
    if (campusId) {
      return res.json(db.flags.filter((f) => f.campusId === campusId));
    }
    res.json(db.flags);
  });

  // 14. PUT /api/flags/:id - Resolve or update flag
  app.put('/api/flags/:id', (req: Request, res: Response) => {
    const idx = db.flags.findIndex((f) => f.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Flag not found' });
    }
    db.flags[idx] = {
      ...db.flags[idx],
      ...req.body,
      id: db.flags[idx].id,
    };
    saveDatabase(db);
    res.json(db.flags[idx]);
  });

  // 15. POST /api/evidence/upload - Simulated OCR bill extraction for Delhi DISCOMs
  app.post('/api/evidence/upload', (req: Request, res: Response) => {
    const { campusId, fileName } = req.body;
    const campus = db.campuses.find((c) => c.id === campusId) || db.campuses[0];

    // Determine DISCOM from campus
    const discom = campus.discom;
    const isTPDDL = discom.includes('Tata Power');
    const prefix = isTPDDL ? 'TPDDL' : 'BRPL';

    const randomUnits = Math.round(35000 + Math.random() * 25000);
    const avgTariff = 9.85; // ~₹9.85/kWh for institutional HT connections in Delhi
    const totalCost = Math.round(randomUnits * avgTariff);
    const invNum = `${prefix}-2025-${Math.floor(100000 + Math.random() * 900000)}`;
    const caNum = `${campus.consumerCaPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const extractedBill: UtilityBill = {
      id: `bill-${campus.id}-${Date.now()}`,
      campusId: campus.id,
      invoiceNumber: invNum,
      utilityProvider: discom,
      accountNumber: caNum,
      siteName: `${campus.abbreviation} Main Campus Feeder`,
      serviceAddress: campus.address,
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      daysInPeriod: 31,
      consumptionKwh: randomUnits,
      peakDemandKw: Math.round(randomUnits / 31 / 24 * 2.1),
      totalCostInr: totalCost,
      ratePerKwh: avgTariff,
      currency: 'INR',
      documentFileName: fileName || `${campus.abbreviation}_${prefix}_Oct2025_Bill.pdf`,
      documentFileSize: '1.4 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'unverified',
      evidenceStatus: 'unverified',
      ocrConfidence: 0.96,
      notes: 'Extracted from primary Delhi DISCOM e-bill PDF. Requires auditor confirmation.',
    };

    db.bills.push(extractedBill);

    // Create auditor verification flag
    db.flags.push({
      id: `flag-${Date.now()}`,
      campusId: campus.id,
      billId: extractedBill.id,
      invoiceNumber: extractedBill.invoiceNumber,
      type: 'unverified_document',
      title: `Auditor Verification Required: ${extractedBill.invoiceNumber}`,
      description: `Newly ingested ${discom} utility bill for ${campus.abbreviation} requires confirmation of kWh consumption (${randomUnits.toLocaleString('en-IN')} kWh) and billing charges.`,
      severity: 'info',
      status: 'pending',
      detectedAt: extractedBill.uploadDate,
    });

    saveDatabase(db);
    res.status(201).json({
      success: true,
      extractedBill,
      message: `Utility bill successfully processed for ${campus.name}`,
    });
  });

  // 16. POST /api/campuses/:id/seed-sample-audit - Seed realistic Delhi verified audit data
  app.post('/api/campuses/:id/seed-sample-audit', (req: Request, res: Response) => {
    const campus = db.campuses.find((c) => c.id === req.params.id);
    if (!campus) {
      return res.status(404).json({ error: 'Campus not found' });
    }

    // Remove old bills and audits for this campus first
    db.bills = db.bills.filter((b) => b.campusId !== campus.id);
    db.audits = db.audits.filter((a) => a.campusId !== campus.id);
    db.flags = db.flags.filter((f) => f.campusId !== campus.id);

    // Create 12 monthly bills for FY 2024-25 / CY 2025
    const months = [
      { start: '2025-01-01', end: '2025-01-31', days: 31, kwh: 42100, cost: 412580 },
      { start: '2025-02-01', end: '2025-02-28', days: 28, kwh: 38400, cost: 376320 },
      { start: '2025-03-01', end: '2025-03-31', days: 31, kwh: 44200, cost: 433160 },
      { start: '2025-04-01', end: '2025-04-30', days: 30, kwh: 49800, cost: 488040 },
      { start: '2025-05-01', end: '2025-05-31', days: 31, kwh: 58900, cost: 589000 }, // Summer cooling peak
      { start: '2025-06-01', end: '2025-06-30', days: 30, kwh: 64200, cost: 648420 },
      { start: '2025-07-01', end: '2025-07-31', days: 31, kwh: 61500, cost: 621150 },
      { start: '2025-08-01', end: '2025-08-31', days: 31, kwh: 57400, cost: 579740 },
      { start: '2025-09-01', end: '2025-09-30', days: 30, kwh: 51200, cost: 517120 },
      { start: '2025-10-01', end: '2025-10-31', days: 31, kwh: 45600, cost: 456000 },
      { start: '2025-11-01', end: '2025-11-30', days: 30, kwh: 41800, cost: 418000 },
      { start: '2025-12-01', end: '2025-12-31', days: 31, kwh: 43200, cost: 432000 },
    ];

    const newBills: UtilityBill[] = months.map((m, idx) => ({
      id: `bill-${campus.id}-2025-${String(idx + 1).padStart(2, '0')}`,
      campusId: campus.id,
      auditId: `audit-${campus.id}-2025`,
      invoiceNumber: `${campus.discom.includes('Tata') ? 'TPDDL' : 'BRPL'}-2025-${1000 + idx}`,
      utilityProvider: campus.discom,
      accountNumber: `${campus.consumerCaPrefix}-${100 + idx}`,
      siteName: `${campus.abbreviation} Main Campus Complex`,
      serviceAddress: campus.address,
      startDate: m.start,
      endDate: m.end,
      daysInPeriod: m.days,
      consumptionKwh: m.kwh,
      peakDemandKw: Math.round(m.kwh / (m.days * 24) * 2.2),
      totalCostInr: m.cost,
      ratePerKwh: Math.round((m.cost / m.kwh) * 100) / 100,
      currency: 'INR',
      documentFileName: `${campus.abbreviation}_Bill_${m.start.slice(0, 7)}.pdf`,
      documentFileSize: '1.3 MB',
      uploadDate: m.end,
      verificationStatus: idx < 11 ? 'user_verified' : 'unverified',
      verifiedBy: idx < 11 ? 'Institutional Auditor' : undefined,
      verifiedAt: idx < 11 ? `${m.end} 14:00` : undefined,
      evidenceStatus: idx < 11 ? 'documented' : 'unverified',
      ocrConfidence: 0.98,
      notes: idx === 5 ? 'Delhi heatwave peak HVAC chiller usage.' : undefined,
    }));

    db.bills.push(...newBills);

    // Create Audit record
    const totalKwh = newBills.reduce((s, b) => s + b.consumptionKwh, 0);
    const totalCost = newBills.reduce((s, b) => s + b.totalCostInr, 0);
    const emissions = (totalKwh * INDIA_EMISSION_FACTORS[0].factorKgPerKwh) / 1000;

    const audit: Audit = {
      id: `audit-${campus.id}-2025`,
      campusId: campus.id,
      periodName: 'Annual Institutional Audit CY 2025',
      reportingYear: 2025,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      status: 'verified',
      totalKwh,
      totalCostInr: totalCost,
      verifiedBillsCount: 11,
      totalBillsCount: 12,
      evidenceCoveragePercent: 91.7,
      activeFlagsCount: 1,
      emissionsTonsCo2e: Math.round(emissions * 100) / 100,
      emissionFactorKgPerKwh: INDIA_EMISSION_FACTORS[0].factorKgPerKwh,
      emissionFactorSource: INDIA_EMISSION_FACTORS[0].name,
      createdAt: '2026-01-10T10:00:00.000Z',
      updatedAt: '2026-01-15T12:00:00.000Z',
    };
    db.audits.push(audit);

    // Create review flag
    db.flags.push({
      id: `flag-${campus.id}-01`,
      campusId: campus.id,
      billId: newBills[11].id,
      invoiceNumber: newBills[11].invoiceNumber,
      type: 'unverified_document',
      title: 'Awaiting Final December Audit Confirmation',
      description: `December 2025 ${campus.discom} statement is pending auditor signature to achieve 100% evidentiary coverage for ${campus.abbreviation}.`,
      severity: 'info',
      status: 'pending',
      detectedAt: '2026-01-05',
    });

    saveDatabase(db);
    res.json({
      success: true,
      message: `Verified sample audit created for ${campus.name}`,
      audit,
      billsCount: newBills.length,
    });
  });

  // 17. GET /api/dashboard/stats - Aggregated Delhi platform stats
  app.get('/api/dashboard/stats', (_req: Request, res: Response) => {
    const verifiedBills = db.bills.filter((b) => b.verificationStatus === 'user_verified');
    const totalKwh = verifiedBills.reduce((acc, b) => acc + (b.consumptionKwh || 0), 0);
    const totalCostInr = verifiedBills.reduce((acc, b) => acc + (b.totalCostInr || 0), 0);
    const activeFlags = db.flags.filter((f) => f.status === 'pending');

    res.json({
      registeredCampusesCount: db.campuses.length,
      campuses: db.campuses.map((c) => ({ id: c.id, name: c.name, abbr: c.abbreviation })),
      totalAuditsCount: db.audits.length,
      totalBillsCount: db.bills.length,
      verifiedBillsCount: verifiedBills.length,
      pendingVerificationCount: db.bills.length - verifiedBills.length,
      totalKwhVerified: totalKwh,
      totalCostInrVerified: totalCostInr,
      activeFlagsCount: activeFlags.length,
      nationalGridEmissionFactor: INDIA_EMISSION_FACTORS[0].factorKgPerKwh,
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    });
  });

  // 18. POST /api/database/reset - Reset to pure initial state (only the 5 Delhi campuses)
  app.post('/api/database/reset', (_req: Request, res: Response) => {
    db = getInitialDatabase();
    saveDatabase(db);
    res.json({ success: true, message: 'Database reset to 5 clean Delhi campuses with 0 audits.' });
  });

  // ==========================================
  // VITE / STATIC MIDDLEWARE MOUNTING
  // ==========================================
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GreenLedger Full-Stack Server running on port ${PORT} [Delhi Ecosystem Ready]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting GreenLedger server:', err);
  process.exit(1);
});
