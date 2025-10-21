export type CustomerData = {
  subscriptionAge: number // months as customer
  monthlyCharge: number // subscription price
  loginFrequency: number // logins in last 30 days
  contentCompletion: number // percentage of content consumed
  failedPayments: number // number of failed payment attempts
  paymentMethod: string // how they pay
  supportTickets: number // support tickets in last 90 days
  contractType: string // monthly, annual, etc.
  daysSinceLastActivity: number // recency metric
}

export type RiskFactor = {
  feature: string
  impact: number
  odds: number
}

export type PredictionResult = {
  probability: number
  riskLevel: "High" | "Low"
  riskFactors: RiskFactor[]
}

// Simplified logistic regression model coefficients
// Based on the Python training script logic
const coefficients = {
  subscriptionAge: -0.08, // longer customers less likely to churn
  monthlyCharge: 0.005, // higher price = slight increase in churn
  loginFrequency: -0.15, // more logins = much less churn
  contentCompletion: -0.03, // higher completion = less churn
  failedPayments: 0.8, // failed payments strongly predict churn
  supportTickets: 0.2, // more tickets = higher churn risk
  daysSinceLastActivity: 0.05, // inactivity predicts churn
  paymentMethodPayPal: 0.2,
  paymentMethodBank: 0.4,
  paymentMethodInvoice: 0.6,
  contractTypeAnnual: -0.5, // annual contracts reduce churn
  contractTypeQuarterly: -0.2,
  intercept: 0.5,
}

// Risk factors database with odds ratios
const riskFactorsDB: Record<string, { impact: number; odds: number }> = {
  "Low Login Frequency": { impact: 85.0, odds: 1.85 },
  "High Inactivity": { impact: 75.0, odds: 1.75 },
  "Failed Payments": { impact: 120.0, odds: 2.2 },
  "Low Content Completion": { impact: 65.0, odds: 1.65 },
  "Invoice Payment": { impact: 82.0, odds: 1.82 },
  "Bank Transfer Payment": { impact: 49.0, odds: 1.49 },
  "Monthly Contract": { impact: 65.0, odds: 1.65 },
  "High Support Tickets": { impact: 45.0, odds: 1.45 },
  "New Customer": { impact: 55.0, odds: 1.55 },
  "High Monthly Charge": { impact: 35.0, odds: 1.35 },
}

export function predictChurn(data: CustomerData): PredictionResult {
  // Calculate logistic regression prediction
  let logit = coefficients.intercept

  logit += coefficients.subscriptionAge * data.subscriptionAge
  logit += coefficients.monthlyCharge * data.monthlyCharge
  logit += coefficients.loginFrequency * data.loginFrequency
  logit += coefficients.contentCompletion * data.contentCompletion
  logit += coefficients.failedPayments * data.failedPayments
  logit += coefficients.supportTickets * data.supportTickets
  logit += coefficients.daysSinceLastActivity * data.daysSinceLastActivity

  // Payment method encoding
  if (data.paymentMethod === "PayPal") logit += coefficients.paymentMethodPayPal
  if (data.paymentMethod === "Bank transfer") logit += coefficients.paymentMethodBank
  if (data.paymentMethod === "Invoice") logit += coefficients.paymentMethodInvoice

  // Contract type encoding (monthly is baseline)
  if (data.contractType === "Annual") logit += coefficients.contractTypeAnnual
  if (data.contractType === "Quarterly") logit += coefficients.contractTypeQuarterly

  // Convert to probability using sigmoid function
  const probability = 1 / (1 + Math.exp(-logit))

  // Determine risk factors based on customer data
  const riskFactors: RiskFactor[] = []

  if (data.loginFrequency < 5) {
    riskFactors.push({
      feature: "Low Login Frequency",
      ...riskFactorsDB["Low Login Frequency"],
    })
  }

  if (data.daysSinceLastActivity > 14) {
    riskFactors.push({
      feature: "High Inactivity",
      ...riskFactorsDB["High Inactivity"],
    })
  }

  if (data.failedPayments > 0) {
    riskFactors.push({
      feature: "Failed Payments",
      ...riskFactorsDB["Failed Payments"],
    })
  }

  if (data.contentCompletion < 30) {
    riskFactors.push({
      feature: "Low Content Completion",
      ...riskFactorsDB["Low Content Completion"],
    })
  }

  if (data.paymentMethod === "Invoice") {
    riskFactors.push({
      feature: "Invoice Payment",
      ...riskFactorsDB["Invoice Payment"],
    })
  } else if (data.paymentMethod === "Bank transfer") {
    riskFactors.push({
      feature: "Bank Transfer Payment",
      ...riskFactorsDB["Bank Transfer Payment"],
    })
  }

  if (data.contractType === "Monthly") {
    riskFactors.push({
      feature: "Monthly Contract",
      ...riskFactorsDB["Monthly Contract"],
    })
  }

  if (data.supportTickets > 3) {
    riskFactors.push({
      feature: "High Support Tickets",
      ...riskFactorsDB["High Support Tickets"],
    })
  }

  if (data.subscriptionAge < 3) {
    riskFactors.push({
      feature: "New Customer",
      ...riskFactorsDB["New Customer"],
    })
  }

  if (data.monthlyCharge > 100) {
    riskFactors.push({
      feature: "High Monthly Charge",
      ...riskFactorsDB["High Monthly Charge"],
    })
  }

  // Sort by impact descending and take top 5
  riskFactors.sort((a, b) => b.impact - a.impact)
  const topRiskFactors = riskFactors.slice(0, 5)

  return {
    probability,
    riskLevel: probability >= 0.5 ? "High" : "Low",
    riskFactors: topRiskFactors,
  }
}
