export function buildPurchaseLineItems(numLineItems, context) {
  // Validate numLineItems parameter
  if (typeof numLineItems !== "number" || !Number.isInteger(numLineItems) || numLineItems <= 0) {
    throw new ConfigurationError("numLineItems must be a positive integer");
  }

  // Validate context parameter
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    throw new ConfigurationError("context must be an object");
  }

  // Validate required keys exist for each line item
  const missingKeys = [];
  for (let i = 1; i <= numLineItems; i++) {
    if (!Object.prototype.hasOwnProperty.call(context, `amount_${i}`)) {
      missingKeys.push(`amount_${i}`);
    }
    if (!Object.prototype.hasOwnProperty.call(context, `item_${i}`)) {
      missingKeys.push(`item_${i}`);
    }
  }

  if (missingKeys.length > 0) {
    throw new ConfigurationError(`Missing required keys in context: ${missingKeys.join(", ")}`);
  }

  // Validate amount values are valid numbers
  const invalidAmounts = [];
  for (let i = 1; i <= numLineItems; i++) {
    const amount = context[`amount_${i}`];
    if (amount !== undefined && amount !== null && amount !== "" &&
        (typeof amount !== "number" && (typeof amount !== "string" || isNaN(parseFloat(amount))))) {
      invalidAmounts.push(`amount_${i}`);
    }
  }

  if (invalidAmounts.length > 0) {
    throw new ConfigurationError(`Invalid amount values for: ${invalidAmounts.join(", ")}. Amounts must be valid numbers.`);
  }

  const lineItems = [];
  for (let i = 1; i <= numLineItems; i++) {
    const detailType = "ItemBasedExpenseLineDetail";

    // Extract conditional logic into clear variables
    const isItemBased = detailType === "ItemBasedExpenseLineDetail";
    const detailPropertyName = isItemBased
      ? "ItemBasedExpenseLineDetail"
      : "AccountBasedExpenseLineDetail";
    const refPropertyName = isItemBased
      ? "ItemRef"
      : "AccountRef";

    // Build line item with clearer structure
    const lineItem = {
      DetailType: detailType,
      Amount: context[`amount_${i}`],
      [detailPropertyName]: {
        [refPropertyName]: {
          value: context[`item_${i}`],
        },
        Qty: context[`quantity_${i}`],
      },
    };

    lineItems.push(lineItem);
  }
  return lineItems;
}
