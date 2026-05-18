import { DEFAULT_SETTINGS } from "../calculations";
import type { Opening, OpeningKind, Project, Room, Wall } from "../types";
import { newId } from "../id";

const mm = (v: number) => v / 1000;

function opening(
  kind: OpeningKind,
  widthMm: number,
  heightMm: number,
  revealDepthMm: number,
  label = "",
): Opening {
  return {
    id: newId(),
    kind,
    label,
    widthM: mm(widthMm),
    heightM: mm(heightMm),
    archRectHeightM: 0,
    revealDepthM: mm(revealDepthMm),
    deduct: true,
    count: 1,
  };
}

function wall(
  label: string,
  lengthMm: number,
  heightMm: number,
  openings: Opening[] = [],
): Wall {
  return {
    id: newId(),
    label,
    lengthM: mm(lengthMm),
    heightM: mm(heightMm),
    openings,
  };
}

function room(name: string, walls: Wall[]): Room {
  return { id: newId(), name, walls };
}

/** Обмерный план «Видинеевский мини», лист 2 */
export function createVidineevskyProject(): Project {
  const rooms: Room[] = [
    room("1. Прихожая / холл", [
      wall("Юг (вход)", 2960, 2723, [
        opening("door", 910, 2073, 105, "Входная дверь"),
      ]),
      wall("Запад", 2010, 2723, [
        opening("door", 815, 2107, 105, "В душевую"),
        opening("door", 750, 2107, 105, "В кладовую"),
      ]),
      wall("Север (к кухне)", 4060, 2723, [
        opening("other", 2755, 2723, 0, "Проём в кухню-гостиную"),
      ]),
      wall("Восток (к спальне)", 2025, 2723, [
        opening("door", 910, 2097, 105, "В спальню"),
      ]),
      wall("К детской", 1185, 2723, [
        opening("door", 915, 2094, 105, "В детскую"),
      ]),
    ]),

    room("2. Кухня-гостиная", [
      wall("Север (фасад)", 6010, 2714, [
        opening("window", 2320, 1719, 204, "Окно 1"),
        opening("window", 2320, 1719, 205, "Окно 2"),
      ]),
      wall("Восток", 3795, 2714),
      wall("Юг (к коридору)", 4705, 2714, [
        opening("other", 2755, 2714, 0, "Проём в коридор"),
      ]),
      wall("Запад (фасад)", 4705, 2714),
    ]),

    room("3. Кладовая", [
      wall("Север", 1800, 2743),
      wall("Восток", 2305, 2743, [
        opening("door", 750, 2107, 105, "В коридор"),
      ]),
      wall("Юг", 1800, 2743),
      wall("Запад", 2305, 2743),
    ]),

    room("4. Спальня", [
      wall("Север (фасад)", 2775, 2714, [
        opening("window", 2315, 1716, 219, "Окно"),
      ]),
      wall("Восток (фасад)", 4705, 2714),
      wall("Юг", 2775, 2714, [
        opening("door", 910, 2097, 105, "В коридор"),
      ]),
      wall("Запад", 4175, 2714),
    ]),

    room("5. Душевая", [
      wall("Север", 3075, 2727),
      wall("Восток", 2025, 2727, [
        opening("door", 815, 2107, 105, "В коридор"),
      ]),
      wall("Юг", 3075, 2727),
      wall("Запад", 2025, 2727),
    ]),

    room("6. Детская", [
      wall("Запад", 4170, 2713),
      wall("Север (к балкону)", 3095, 2713, [
        opening("window", 1505, 1713, 222, "Окно / балконный блок"),
      ]),
      wall("Восток", 4445, 2713, [
        opening("door", 915, 2094, 105, "В коридор"),
      ]),
      wall("Юг", 3100, 2713, [
        opening("other", 1400, 2356, 222, "Дверь на балкон"),
      ]),
      wall("Ниша (восток)", 270, 2713),
    ]),

    room("7. Балкон", [
      wall("Север", 3095, 2713, [
        opening("window", 1505, 1713, 222, "Со стороны детской"),
      ]),
      wall("Восток", 875, 2713),
      wall("Запад", 875, 2713),
      wall("Юг (к квартире)", 3095, 2713, [
        opening("other", 1400, 2356, 222, "Дверь с детской"),
      ]),
    ]),
  ];

  return {
    id: newId(),
    name: "Видинеевский",
    rooms,
    settings: {
      ...DEFAULT_SETTINGS,
      minDeductAreaM2: 0.5,
    },
  };
}
