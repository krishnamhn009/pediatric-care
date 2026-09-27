import { z } from "zod";

// Simple obfuscation layer for PHI in localStorage (demo-grade, not real crypto)
// Prevents plain-text PHI in DevTools; real app should use httpOnly cookie + server encryption
const PREFIX = "pcn_v1_";

function encrypt(value: unknown): string {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(value))));
  } catch {
    return btoa(JSON.stringify(value));
  }
}

function decrypt<T>(raw: string | null, fallback: T, schema?: z.ZodTypeAny): T {
  if (!raw) return fallback;
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const parsed = JSON.parse(json);
    if (schema) {
      const res = schema.safeParse(parsed);
      return res.success ? (res.data as T) : fallback;
    }
    return parsed as T;
  } catch {
    // fallback to plain JSON for migration
    try {
      const parsed = JSON.parse(raw);
      if (schema) {
        const res = schema.safeParse(parsed);
        return res.success ? (res.data as T) : fallback;
      }
      return parsed as T;
    } catch {
      return fallback;
    }
  }
}

export function secureGet<T>(
  key: string,
  fallback: T,
  schema?: z.ZodTypeAny
): T {
  if (typeof window === "undefined") return fallback;
  const raw =
    localStorage.getItem(PREFIX + key) ?? localStorage.getItem("pcn_" + key);
  return decrypt(raw, fallback, schema);
}

export function secureSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFIX + key, encrypt(value));
}

export function secureRemove(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PREFIX + key);
}

export function clearAllSecure() {
  if (typeof window === "undefined") return;
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith(PREFIX) || k.startsWith("pcn_"))
      localStorage.removeItem(k);
  });
}

// Zod schemas for validation (permissive passthrough — ensures array shape, not strict field enforcement)
export const patientSchema = z.array(z.record(z.string(), z.any()));
export const alertSchema = z.array(z.record(z.string(), z.any()));
export const paymentSchema = z.array(z.record(z.string(), z.any()));
