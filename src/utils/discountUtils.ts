/**
 * Calculate the discounted price for a cart item based on discount info.
 * Returns null if no discount applies.
 */
export const getDiscountedPrice = (
  price: number,
  discountInfo: any
): number | null => {
  if (!discountInfo) return null;

  const discountType = discountInfo.type || discountInfo.discountType;
  const discountValue = discountInfo.value || discountInfo.discountValue;
  const dPrice = discountInfo.discountedPrice;

  if (discountType === "PERCENTAGE") {
    if (discountValue) {
      return price - (price * discountValue) / 100;
    } else if (dPrice) {
      return Number(dPrice);
    }
  } else if (discountType === "FIXED" && discountValue) {
    return price - discountValue;
  } else if (dPrice && dPrice < price) {
    return Number(dPrice);
  }

  return null;
};

/**
 * Find the discount info for a specific variant from the discounts data.
 */
export const findDiscountInfo = (
  discounts: any,
  productVariantId: number
): any => {
  if (Array.isArray(discounts)) {
    return discounts.find(
      (d: any) =>
        d?.productVariantId === productVariantId ||
        d?.variantId === productVariantId
    );
  }
  return discounts?.[productVariantId];
};

type CartItemLike = {
  productVariantId: number;
  price: number;
  quantity: number;
};

/**
 * Calculate the subtotal for cart items with discounts applied.
 */
export const calcDiscountedSubtotal = (
  cartItems: CartItemLike[],
  discounts: any
): number => {
  return cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const discountInfo = findDiscountInfo(discounts, item.productVariantId);
    const discountedPrice = getDiscountedPrice(price, discountInfo);
    return sum + (discountedPrice ?? price) * item.quantity;
  }, 0);
};

/**
 * Calculate the original subtotal (no discounts).
 */
export const calcOriginalSubtotal = (cartItems: CartItemLike[]): number => {
  return cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);
};
