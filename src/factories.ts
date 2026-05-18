import { DEFAULT_SETTINGS } from "./calculations";
import { newId } from "./id";
import type { Opening, OpeningKind, Room, Wall } from "./types";

export function createWall(label = ""): Wall {
  return {
    id: newId(),
    label,
    lengthM: 0,
    heightM: 2.7,
    openings: [],
  };
}

export function createOpening(kind: OpeningKind = "window"): Opening {
  return {
    id: newId(),
    kind,
    label: "",
    widthM: 0,
    heightM: 0,
    archRectHeightM: 0,
    revealDepthM: DEFAULT_SETTINGS.defaultRevealDepthM[kind],
    deduct: true,
    count: 1,
  };
}

export function createRoom(name = "Помещение"): Room {
  return {
    id: newId(),
    name,
    walls: [],
  };
}

/** Прямоугольное помещение: 4 стены по периметру */
export function createRectRoom(
  name: string,
  lengthM: number,
  widthM: number,
  heightM: number,
): Room {
  return {
    id: newId(),
    name,
    walls: [
      { ...createWall("Стена 1"), lengthM: lengthM, heightM },
      { ...createWall("Стена 2"), lengthM: widthM, heightM },
      { ...createWall("Стена 3"), lengthM: lengthM, heightM },
      { ...createWall("Стена 4"), lengthM: widthM, heightM },
    ],
  };
}
