export interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principalAmount: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface LoanScenario {
  id: string;
  label: string;
  principal: number;
  annualRate: number;
  tenureMonths: number;
  color: string;
}

/**
 * Calculate EMI using the standard formula:
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * where:
 *   P = Principal loan amount
 *   r = Monthly interest rate (annual rate / 12 / 100)
 *   n = Number of monthly installments
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): EMIResult {
  if (principal <= 0 || annualRate < 0 || tenureMonths <= 0) {
    return {
      emi: 0,
      totalPayment: 0,
      totalInterest: 0,
      principalAmount: principal,
      amortizationSchedule: [],
    };
  }

  // Handle 0% interest rate (rare but possible)
  if (annualRate === 0) {
    const emi = principal / tenureMonths;
    const schedule: AmortizationEntry[] = [];
    let balance = principal;
    let cumulativePrincipal = 0;

    for (let month = 1; month <= tenureMonths; month++) {
      const principalPart = month === tenureMonths ? balance : emi;
      cumulativePrincipal += principalPart;
      balance = Math.max(0, balance - principalPart);
      schedule.push({
        month,
        emi,
        principal: principalPart,
        interest: 0,
        balance,
        cumulativeInterest: 0,
        cumulativePrincipal,
      });
    }

    return {
      emi,
      totalPayment: principal,
      totalInterest: 0,
      principalAmount: principal,
      amortizationSchedule: schedule,
    };
  }

  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const pow = Math.pow(1 + r, n);
  const emi = (principal * r * pow) / (pow - 1);

  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  // Build amortization schedule
  const schedule: AmortizationEntry[] = [];
  let balance = principal;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  for (let month = 1; month <= n; month++) {
    const interestPart = balance * r;
    const principalPart = emi - interestPart;
    balance = Math.max(0, balance - principalPart);
    cumulativeInterest += interestPart;
    cumulativePrincipal += principalPart;

    schedule.push({
      month,
      emi: parseFloat(emi.toFixed(2)),
      principal: parseFloat(principalPart.toFixed(2)),
      interest: parseFloat(interestPart.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
      cumulativeInterest: parseFloat(cumulativeInterest.toFixed(2)),
      cumulativePrincipal: parseFloat(cumulativePrincipal.toFixed(2)),
    });
  }

  return {
    emi: parseFloat(emi.toFixed(2)),
    totalPayment: parseFloat(totalPayment.toFixed(2)),
    totalInterest: parseFloat(totalInterest.toFixed(2)),
    principalAmount: principal,
    amortizationSchedule: schedule,
  };
}

/**
 * Format a number as Indian currency (₹)
 */
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with Indian number system commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(num));
}

/**
 * Format tenure in a human-readable way
 */
export function formatTenure(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${months} months`;
  if (remainingMonths === 0) return `${years} yr${years > 1 ? "s" : ""}`;
  return `${years} yr${years > 1 ? "s" : ""} ${remainingMonths} mo`;
}

/**
 * Get chart data grouped by year for the amortization chart
 */
export function getYearlyChartData(schedule: AmortizationEntry[]) {
  const yearly: { year: number; principal: number; interest: number; balance: number }[] = [];

  for (let i = 0; i < schedule.length; i += 12) {
    const yearEntries = schedule.slice(i, i + 12);
    const yearNum = Math.floor(i / 12) + 1;
    const totalPrincipal = yearEntries.reduce((sum, e) => sum + e.principal, 0);
    const totalInterest = yearEntries.reduce((sum, e) => sum + e.interest, 0);
    const lastBalance = yearEntries[yearEntries.length - 1]?.balance ?? 0;

    yearly.push({
      year: yearNum,
      principal: parseFloat(totalPrincipal.toFixed(2)),
      interest: parseFloat(totalInterest.toFixed(2)),
      balance: parseFloat(lastBalance.toFixed(2)),
    });
  }

  return yearly;
}
