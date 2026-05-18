import { mergeSettings } from "./calculations";
import type { Opening, OpeningKind, Project, Room, Wall } from "./types";
import { newId } from "./id";

const STORAGE_KEY = "wall-area-calculator-v2";

const OPENING_KINDS: OpeningKind[] = ["window", "door", "arch", "other"];

export function createEmptyProject(): Project {
  return {
    id: newId(),
    name: "Новый объект",
    rooms: [],
    settings: mergeSettings(),
  };
}

function isOpeningKind(v: unknown): v is OpeningKind {
  return typeof v === "string" && OPENING_KINDS.includes(v as OpeningKind);
}

function sanitizeOpening(raw: unknown): Opening | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<Opening>;
  if (!isOpeningKind(o.kind)) return null;
  return {
    id: typeof o.id === "string" ? o.id : newId(),
    kind: o.kind,
    label: typeof o.label === "string" ? o.label : "",
    widthM: num(o.widthM),
    heightM: num(o.heightM),
    archRectHeightM: num(o.archRectHeightM),
    revealDepthM: num(o.revealDepthM),
    deduct: o.deduct !== false,
    count: Math.max(1, Math.round(num(o.count)) || 1),
  };
}

function sanitizeWall(raw: unknown): Wall | null {
  if (!raw || typeof raw !== "object") return null;
  const w = raw as Partial<Wall>;
  const openings = Array.isArray(w.openings)
    ? w.openings.map(sanitizeOpening).filter((o): o is Opening => o !== null)
    : [];
  return {
    id: typeof w.id === "string" ? w.id : newId(),
    label: typeof w.label === "string" ? w.label : "",
    lengthM: num(w.lengthM),
    heightM: num(w.heightM),
    openings,
  };
}

function sanitizeRoom(raw: unknown): Room | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<Room>;
  const walls = Array.isArray(r.walls)
    ? r.walls.map(sanitizeWall).filter((w): w is Wall => w !== null)
    : [];
  return {
    id: typeof r.id === "string" ? r.id : newId(),
    name: typeof r.name === "string" ? r.name : "Помещение",
    walls,
  };
}

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

function parseProject(raw: unknown): Project | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<Project>;
  const rooms = Array.isArray(p.rooms)
    ? p.rooms.map(sanitizeRoom).filter((r): r is Room => r !== null)
    : [];
  return {
    id: typeof p.id === "string" ? p.id : newId(),
    name: typeof p.name === "string" ? p.name : "Новый объект",
    rooms,
    settings: mergeSettings(p.settings),
  };
}

/** Миграция с v1 ключа */
function loadLegacyV1(): Project | null {
  try {
    const raw = localStorage.getItem("wall-area-calculator-v1");
    if (!raw) return null;
    return parseProject(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function loadProject(): Project {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = parseProject(JSON.parse(raw));
      if (parsed) return parsed;
    }
    const legacy = loadLegacyV1();
    if (legacy) {
      saveProject(legacy);
      return legacy;
    }
  } catch {
    /* ignore */
  }
  return createEmptyProject();
}

export function saveProject(project: Project): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}

export function clearProject(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("wall-area-calculator-v1");
}
