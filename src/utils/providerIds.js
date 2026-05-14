/** Listing/detail/book route id for a registered provider offering. Mock ids stay p1, p2, … */
export function makeUserProviderListingId(userId, catalogServiceId) {
  return `up_${userId}__${catalogServiceId}`;
}

export function parseUserProviderListingId(id) {
  if (typeof id !== "string" || !id.startsWith("up_")) return null;
  const sep = "__";
  const idx = id.indexOf(sep);
  if (idx === -1) return null;
  const userId = id.slice(3, idx);
  const catalogServiceId = id.slice(idx + sep.length);
  if (!userId || !catalogServiceId) return null;
  return { userId, catalogServiceId };
}
