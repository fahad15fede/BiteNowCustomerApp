// 1150 → "1,150"
const withCommas = (n: number) =>
  Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// 1150 → "Rs 1,150"
export const formatPrice = (amount: number) => `Rs ${withCommas(amount)}`;

// 0 → "Free delivery",  99 → "Rs 99 delivery"
export const formatDeliveryFee = (fee: number) =>
  fee === 0 ? "Free delivery" : `${formatPrice(fee)} delivery`;

// (20, 30) → "20-30 min"
export const formatDeliveryTime = (min: number, max: number) => `${min}-${max} min`;