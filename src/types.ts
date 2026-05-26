export interface CustomsRates {
  ئاسایی: number;
  لوکس: number;
  پیشەسازی: number;
}

export interface FixedFees {
  sonar: number;
  cbi: number;
  port: number;
}

export interface CurrencySettings {
  official: number;
  market: number;
}

export interface NationalProtection {
  enabled: boolean;
  rate: number;
}

export interface SystemSettings {
  customs_rates: CustomsRates;
  fixed_fees: FixedFees;
  currency: CurrencySettings;
  protection: NationalProtection;
}

export interface CustomsLists {
  allowed: string[];
  restricted: string[];
  prohibited: string[];
}

export interface CalculatorState {
  category: keyof CustomsRates;
  weight: number;
  declaredValue: number;
  extraSonar: number;
  extraLicense: number;
  extraQuality: number;
}

export interface CalculationResult {
  baseTaxUsd: number;
  protectionTaxUsd: number;
  extraFeesUsd: number;
  totalCostUsd: number;
  totalCostIqdOfficial: number;
  totalCostIqdMarket: number;
  customsRatePercentage: number;
  protectionRatePercentage: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
