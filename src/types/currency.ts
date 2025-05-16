export interface Rate {
  currency: string;
  pair: string;
  ask: string;
  bid: string;
}

export interface CurrencyConverterHook {
  amount: string;
  baseCurrency: string;
  rates: Rate[];
  loading: boolean;
  error: Error | null;
  handleAmountChange: (amount: string) => void;
  handleCurrencyChange: (currency: string) => void;
}