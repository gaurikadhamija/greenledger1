/**
 * Reusable formatting utilities for Indian currency (INR ₹),
 * electrical energy (kWh), greenhouse gas emissions (tonnes CO2e),
 * and Indian date standards (Asia/Kolkata timezone).
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const inrCompactFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 1,
  notation: 'compact',
});

const inNumberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 1,
});

/**
 * Formats a monetary amount in Indian Rupees (INR) using standard en-IN grouping (e.g. ₹12,500.00, ₹1,48,200.00)
 */
export function formatInr(amount: number | null | undefined, options?: { compact?: boolean }): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }
  if (options?.compact && Math.abs(amount) >= 100000) {
    return inrCompactFormatter.format(amount);
  }
  return inrFormatter.format(amount);
}

/**
 * Formats electricity consumption in kilowatt-hours (kWh)
 */
export function formatKwh(kwh: number | null | undefined): string {
  if (kwh === null || kwh === undefined || isNaN(kwh)) {
    return '—';
  }
  return `${inNumberFormatter.format(Math.round(kwh))} kWh`;
}

/**
 * Formats carbon emissions in metric tonnes of CO2 equivalent
 */
export function formatEmissions(tons: number | null | undefined): string {
  if (tons === null || tons === undefined || isNaN(tons)) {
    return '—';
  }
  return `${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(tons)} t CO₂e`;
}

/**
 * Formats percentage changes with explicit sign
 */
export function formatPercent(percent: number | null | undefined, showSign = true): string {
  if (percent === null || percent === undefined || isNaN(percent)) {
    return '—';
  }
  const formatted = Math.abs(percent).toFixed(1);
  if (!showSign) return `${formatted}%`;
  if (percent > 0) return `+${formatted}%`;
  if (percent < 0) return `-${formatted}%`;
  return `0.0%`;
}

/**
 * Formats dates according to Indian convention (e.g., 28 Oct 2025) in Asia/Kolkata timezone
 */
export function formatDateIn(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * Formats electricity tariff rates in INR/kWh (e.g. ₹9.85 / kWh)
 */
export function formatTariffRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return '—';
  }
  return `₹${rate.toFixed(2)} / kWh`;
}
