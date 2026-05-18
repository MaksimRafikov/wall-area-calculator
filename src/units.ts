export const MM_PER_M = 1000;
export const MM2_PER_M2 = 1_000_000;

export function mToMm(m: number): number {
  if (!Number.isFinite(m) || m <= 0) return 0;
  return Math.round(m * MM_PER_M);
}

export function mmToM(mm: number): number {
  return mm / MM_PER_M;
}

export function m2ToMm2(m2: number): number {
  if (!Number.isFinite(m2) || m2 <= 0) return 0;
  return Math.round(m2 * MM2_PER_M2);
}

export function mm2ToM2(mm2: number): number {
  return mm2 / MM2_PER_M2;
}
