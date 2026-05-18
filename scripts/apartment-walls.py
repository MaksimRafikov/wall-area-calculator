# -*- coding: utf-8 -*-
"""Расчёт площади стен по обмерному плану «Видинеевский мини» (мм → м²)."""

from dataclasses import dataclass


@dataclass
class Opening:
    width_mm: float
    height_mm: float
    count: int = 1


@dataclass
class Room:
    name: str
    plan_no: int
    floor_exp_m2: float | None
    floor_plan_m2: float | None
    height_mm: float
    wall_lengths_mm: list[float]
    openings: list[Opening]
    note: str = ""


def gross_m2(lengths_mm: list[float], h_mm: float) -> float:
    return sum(lengths_mm) * h_mm / 1_000_000


def deduct_m2(openings: list[Opening]) -> float:
    return sum(o.width_mm * o.height_mm * o.count for o in openings) / 1_000_000


def calc(room: Room) -> dict:
    g = gross_m2(room.wall_lengths_mm, room.height_mm)
    d = deduct_m2(room.openings)
    return {
        "gross": g,
        "deduct": d,
        "net": g - d,
        "perimeter_m": sum(room.wall_lengths_mm) / 1000,
    }


# Геометрия по обмерному плану (номера на чертеже)
rooms = [
  Room(
    "Кухня-гостиная",
    3,
    25.81,
    26.72,
    2714,
    [6010, 3795, 4705, 4705],  # юг: 1950 + проём 2755
    [
      Opening(2320, 1719),
      Opening(2320, 1719),
      Opening(2755, 2714),  # проём в коридор (без двери на плане)
    ],
    "Два окна 2320×1719; проём в коридор 2755 на всю высоту",
  ),
  Room(
    "Кладовая",
    2,
    4.14,
    4.15,
    2743,
    [1800, 2305, 1800, 2305],
    [Opening(750, 2107)],
  ),
  Room(
    "Спальня",
    4,
    12.37,
    12.39,
    2714,
    [2775, 4705, 2775, 4175],
    [Opening(2315, 1716), Opening(910, 2097)],
    "Окно 2315; дверь в коридор 910×2097",
  ),
  Room(
    "Душевая",
    5,
    5.49,
    6.23,
    2727,
    [3075, 2025, 3075, 2025],
    [Opening(815, 2107)],
  ),
  Room(
    "Детская",
    6,
    16.28,
    13.30,
    2713,
    [4170, 3095, 4445, 1700, 270],
    [
      Opening(1505, 1713),  # окно на верхней стене
      Opening(915, 2094),  # дверь в коридор
      Opening(1400, 2356),  # выход на балкон (Hдв балкона)
    ],
    "Ниша 270 мм; S пола в экспликации 16,28 ≠ 13,30 на плане",
  ),
  Room(
    "Балкон",
    7,
    None,
    2.71,
    2713,
    [3095, 875, 875],  # 3 стороны, сторона к квартире — проёмы
    [Opening(1400, 2356), Opening(1505, 1713)],
    "Не в экспликации 77,19; проёмы со стороны детской",
  ),
  Room(
    "Прихожая / холл (зона №1 на плане)",
    1,
    7.68 + 5.42,
    12.69,
    2723,
    # Контур L-образного коридора по размерам плана
    [2960, 2025, 4060, 2010, 1185],
    [
      Opening(910, 2073),  # входная дверь
      Opening(750, 2107),  # в кладовую
      Opening(815, 2107),  # в душевую
      Opening(915, 2094),  # в детскую
      Opening(910, 2097),  # в спальню
    ],
    "Экспликация: прихожая 7,68 + холл 5,42; на плане одна зона 12,69",
  ),
]

print("=" * 90)
print(f"{'Помещение':<32} {'№':>2} {'H,м':>5} {'Перим,м':>7} {'Брутто':>8} {'Вычет':>8} {'Чистая':>8}")
print("=" * 90)

tot_g = tot_d = tot_n = 0
for r in rooms:
    c = calc(r)
    tot_g += c["gross"]
    tot_d += c["deduct"]
    tot_n += c["net"]
    print(
      f"{r.name:<32} {r.plan_no:>2} {r.height_mm/1000:>5.2f} {c['perimeter_m']:>7.2f} "
      f"{c['gross']:>8.2f} {c['deduct']:>8.2f} {c['net']:>8.2f}"
    )

print("-" * 90)
print(f"{'ИТОГО (сумма по комнатам)':<32} {'':>2} {'':>5} {'':>7} {tot_g:>8.2f} {tot_d:>8.2f} {tot_n:>8.2f}")
print()
print("Примечание: общие стены между комнатами учтены дважды (норма для сметы по помещениям).")
