import { useCurrency } from "../context/CurrencyContext";

/**
 * Price display component - uses CurrencyContext for INR/USD toggle
 */
export default function PriceDisplay({ amount, className = "" }) {
  const { formatAmount } = useCurrency();
  return <span className={className}>{formatAmount(amount)}</span>;
}
