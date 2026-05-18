import type {
  Opening,
  OpeningCalc,
  OpeningKind,
  Project,
  ProjectCalc,
  ProjectSettings,
  RevealTotals,
  Room,
  RoomCalc,
  Wall,
  WallCalc,
} from "./types";

const PI = Math.PI;

export const DEFAULT_SETTINGS: ProjectSettings = {
  minDeductAreaM2: 0.5,
  defaultRevealDepthM: {
    window: 0.15,
    door: 0.1,
    arch: 0.12,
    other: 0.12,
  },
};

/** Площадь кругового сегмента по хорде w и стреле archHeight */
function circularSegmentAreaM2(width: number, archHeight: number): number {
  if (width <= 0 || archHeight <= 0) return 0;
  const R = (width * width) / (8 * archHeight) + archHeight / 2;
  const d = R - archHeight;
  return R * R * Math.acos(d / R) - d * (width / 2);
}

/** Длина дуги сегмента */
function circularSegmentArcM(width: number, archHeight: number): number {
  if (width <= 0 || archHeight <= 0) return 0;
  const R = (width * width) / (8 * archHeight) + archHeight / 2;
  return 2 * R * Math.asin(Math.min(1, width / (2 * R)));
}

function archPartAreaM2(width: number, archHeight: number): number {
  const r = width / 2;
  if (archHeight >= r) {
    return (PI * r * r) / 2 + (archHeight - r) * width;
  }
  return circularSegmentAreaM2(width, archHeight);
}

function archPartArcM(width: number, archHeight: number): number {
  const r = width / 2;
  if (archHeight >= r) {
    return PI * r;
  }
  return circularSegmentArcM(width, archHeight);
}

/** Площадь одного проёма (м²) */
export function openingAreaM2(opening: Opening): number {
  const { widthM: w, heightM: h, archRectHeightM } = opening;
  if (w <= 0 || h <= 0) return 0;

  if (opening.kind !== "arch") {
    return w * h;
  }

  const rectH = Math.min(Math.max(archRectHeightM, 0), h);
  const archHeight = h - rectH;
  if (archHeight <= 0) {
    return w * rectH;
  }

  return w * rectH + archPartAreaM2(w, archHeight);
}

/** Периметр проёма для откосов (м) — внутренний контур */
export function openingPerimeterM(opening: Opening): number {
  const { widthM: w, heightM: h, archRectHeightM } = opening;
  if (w <= 0 || h <= 0) return 0;

  if (opening.kind !== "arch") {
    return 2 * (w + h);
  }

  const rectH = Math.min(Math.max(archRectHeightM, 0), h);
  const archHeight = h - rectH;
  if (archHeight <= 0) {
    return 2 * (w + rectH);
  }

  return w + 2 * rectH + archPartArcM(w, archHeight);
}

export function isWindowKind(kind: OpeningKind): boolean {
  return kind === "window";
}

export function revealAreaM2(opening: Opening): number {
  const depth = opening.revealDepthM;
  const count = Math.max(1, Math.round(opening.count) || 1);
  if (depth <= 0) return 0;
  return openingPerimeterM(opening) * depth * count;
}

function splitRevealM2(opening: Opening): Pick<OpeningCalc, "windowRevealM2" | "openingRevealM2"> {
  const total = revealAreaM2(opening);
  if (isWindowKind(opening.kind)) {
    return { windowRevealM2: total, openingRevealM2: 0 };
  }
  return { windowRevealM2: 0, openingRevealM2: total };
}

function sumReveals(items: { windowRevealM2: number; openingRevealM2: number }[]): RevealTotals {
  const windowRevealM2 = items.reduce((s, i) => s + i.windowRevealM2, 0);
  const openingRevealM2 = items.reduce((s, i) => s + i.openingRevealM2, 0);
  return {
    windowRevealM2,
    openingRevealM2,
    totalRevealM2: windowRevealM2 + openingRevealM2,
  };
}

function calcOpening(opening: Opening, settings: ProjectSettings): OpeningCalc {
  const unitArea = openingAreaM2(opening);
  const count = Math.max(1, Math.round(opening.count) || 1);
  const areaM2 = unitArea * count;
  const totalForThreshold = areaM2;
  const meetsMin = totalForThreshold >= settings.minDeductAreaM2;
  const deductAreaM2 = opening.deduct && meetsMin ? areaM2 : 0;
  const reveals = splitRevealM2({ ...opening, count });

  return {
    opening,
    areaM2,
    deductAreaM2,
    ...reveals,
    revealAreaM2: reveals.windowRevealM2 + reveals.openingRevealM2,
  };
}

function calcWall(wall: Wall, settings: ProjectSettings): WallCalc {
  const grossM2 = Math.max(wall.lengthM, 0) * Math.max(wall.heightM, 0);
  const openings = wall.openings.map((o) => calcOpening(o, settings));
  const deductM2 = openings.reduce((s, o) => s + o.deductAreaM2, 0);
  const netM2 = Math.max(grossM2 - deductM2, 0);
  const reveals = sumReveals(openings);

  return { wall, grossM2, deductM2, netM2, openings, ...reveals };
}

function calcRoom(room: Room, settings: ProjectSettings): RoomCalc {
  const walls = room.walls.map((w) => calcWall(w, settings));
  const sum = (key: "grossM2" | "deductM2" | "netM2") =>
    walls.reduce((s, w) => s + w[key], 0);
  const reveals = sumReveals(walls);

  return {
    room,
    walls,
    grossM2: sum("grossM2"),
    deductM2: sum("deductM2"),
    netM2: sum("netM2"),
    ...reveals,
  };
}

export function calcProject(project: Project): ProjectCalc {
  const settings = mergeSettings(project.settings);
  const rooms = (project.rooms ?? []).map((r) => calcRoom(r, settings));
  const totals = rooms.reduce(
    (acc, r) => ({
      grossM2: acc.grossM2 + r.grossM2,
      deductM2: acc.deductM2 + r.deductM2,
      netM2: acc.netM2 + r.netM2,
      windowRevealM2: acc.windowRevealM2 + r.windowRevealM2,
      openingRevealM2: acc.openingRevealM2 + r.openingRevealM2,
      totalRevealM2: acc.totalRevealM2 + r.totalRevealM2,
    }),
    {
      grossM2: 0,
      deductM2: 0,
      netM2: 0,
      windowRevealM2: 0,
      openingRevealM2: 0,
      totalRevealM2: 0,
    },
  );

  return { rooms, totals };
}

export function mergeSettings(partial?: Partial<ProjectSettings>): ProjectSettings {
  const base = DEFAULT_SETTINGS;
  if (!partial) return { ...base, defaultRevealDepthM: { ...base.defaultRevealDepthM } };
  return {
    minDeductAreaM2:
      typeof partial.minDeductAreaM2 === "number" && partial.minDeductAreaM2 >= 0
        ? partial.minDeductAreaM2
        : base.minDeductAreaM2,
    defaultRevealDepthM: {
      ...base.defaultRevealDepthM,
      ...(partial.defaultRevealDepthM ?? {}),
    },
  };
}
