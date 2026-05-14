/** Letters and spaces only (Unicode letters allowed), min length after trim. */
export function validateRegistrationName(name) {
  const t = String(name ?? "").trim();
  if (t.length < 2) return { ok: false, message: "Name must be at least 2 characters long." };
  if (!/^[\p{L}\s]+$/u.test(t)) return { ok: false, message: "Name must contain only letters." };
  return { ok: true, value: t };
}

export function validateRegistrationEmail(email) {
  const t = String(email ?? "").trim();
  if (!t) return { ok: false, message: "Email is required." };
  // Practical HTML5-style email check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return { ok: false, message: "Enter a valid email address." };
  return { ok: true, value: t };
}

export function validateRegistrationPassword(password) {
  const p = String(password ?? "");
  if (p.length < 8) return { ok: false, message: "Password must be at least 8 characters long." };
  if (!/[a-z]/.test(p)) return { ok: false, message: "Password must include a lowercase letter." };
  if (!/[A-Z]/.test(p)) return { ok: false, message: "Password must include an uppercase letter." };
  if (!/[0-9]/.test(p)) return { ok: false, message: "Password must include a number." };
  if (!/[^A-Za-z0-9]/.test(p)) return { ok: false, message: "Password must include a special character." };
  return { ok: true, value: p };
}

export function validateRegistrationForm({ name, email, password }) {
  const n = validateRegistrationName(name);
  if (!n.ok) return n;
  const e = validateRegistrationEmail(email);
  if (!e.ok) return e;
  const pw = validateRegistrationPassword(password);
  if (!pw.ok) return pw;
  return { ok: true, name: n.value, email: e.value, password: pw.value };
}
