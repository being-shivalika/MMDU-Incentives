// Advanced rule guards that can override static transitions dynamically
// E.g., if incentive amount > 50,000 INR, enforce additional RPC verification tier.

export const evaluateTransitionGuards = (submission, action, user) => {
  // Add custom guard logic here
  // Returns { allowed: boolean, reason?: string }
  if (action === "RELEASE_PAYMENT") {
    if (user.role !== "accounts") {
      return { allowed: false, reason: "Only accounts role can release payments." };
    }
  }
  return { allowed: true };
};
