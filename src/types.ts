export type OpeningKind = "window" | "door" | "arch" | "other";

export interface ProjectSettings {
  /** Мин. площадь проёма для вычитания (м²), по умолчанию 0.5 */
  minDeductAreaM2: number;
  defaultRevealDepthM: Record<OpeningKind, number>;
}

export interface Opening {
  id: string;
  kind: OpeningKind;
  label: string;
  widthM: number;
  heightM: number;
  /** Для арки: высота прямоугольной части (м). 0 = вся высота — полуарка */
  archRectHeightM: number;
  revealDepthM: number;
  /** Вычитать из чистой площади стен */
  deduct: boolean;
  count: number;
}

export interface Wall {
  id: string;
  label: string;
  lengthM: number;
  heightM: number;
  openings: Opening[];
}

export interface Room {
  id: string;
  name: string;
  walls: Wall[];
}

export interface Project {
  id: string;
  name: string;
  rooms: Room[];
  settings: ProjectSettings;
}

export interface RevealTotals {
  windowRevealM2: number;
  openingRevealM2: number;
  totalRevealM2: number;
}

export interface OpeningCalc {
  opening: Opening;
  areaM2: number;
  deductAreaM2: number;
  windowRevealM2: number;
  openingRevealM2: number;
  revealAreaM2: number;
}

export interface WallCalc extends RevealTotals {
  wall: Wall;
  grossM2: number;
  deductM2: number;
  netM2: number;
  openings: OpeningCalc[];
}

export interface RoomCalc extends RevealTotals {
  room: Room;
  walls: WallCalc[];
  grossM2: number;
  deductM2: number;
  netM2: number;
}

export interface ProjectCalc {
  rooms: RoomCalc[];
  totals: RevealTotals & {
    grossM2: number;
    deductM2: number;
    netM2: number;
  };
}
