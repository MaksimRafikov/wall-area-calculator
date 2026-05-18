import type { ProjectCalc } from "./types";

function fmt(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

export function buildEstimateCsv(calc: ProjectCalc): string {
  const lines: string[] = [];

  lines.push("=== Стены ===");
  lines.push("Помещение;Стена;Брутто, м²;Вычет, м²;Чистая, м²");

  for (const room of calc.rooms) {
    for (const wall of room.walls) {
      lines.push(
        [
          room.room.name,
          wall.wall.label || "—",
          fmt(wall.grossM2),
          fmt(wall.deductM2),
          fmt(wall.netM2),
        ].join(";"),
      );
    }
    lines.push(
      [
        `${room.room.name} — итого стены`,
        "",
        fmt(room.grossM2),
        fmt(room.deductM2),
        fmt(room.netM2),
      ].join(";"),
    );
  }

  lines.push(
    ["ВСЕГО стены", "", fmt(calc.totals.grossM2), fmt(calc.totals.deductM2), fmt(calc.totals.netM2)].join(
      ";",
    ),
  );

  lines.push("");
  lines.push("=== Откосы по помещениям ===");
  lines.push("Помещение;Откосы окон, м²;Откосы проёмов, м²;Итого откосов, м²");

  for (const room of calc.rooms) {
    lines.push(
      [
        room.room.name,
        fmt(room.windowRevealM2),
        fmt(room.openingRevealM2),
        fmt(room.totalRevealM2),
      ].join(";"),
    );
  }

  lines.push(
    [
      "ВСЕГО откосы",
      fmt(calc.totals.windowRevealM2),
      fmt(calc.totals.openingRevealM2),
      fmt(calc.totals.totalRevealM2),
    ].join(";"),
  );

  lines.push("");
  lines.push("=== Откосы по стенам ===");
  lines.push("Помещение;Стена;Откосы окон, м²;Откосы проёмов, м²;Итого, м²");

  for (const room of calc.rooms) {
    for (const wall of room.walls) {
      if (wall.totalRevealM2 <= 0) continue;
      lines.push(
        [
          room.room.name,
          wall.wall.label || "—",
          fmt(wall.windowRevealM2),
          fmt(wall.openingRevealM2),
          fmt(wall.totalRevealM2),
        ].join(";"),
      );
    }
  }

  return `\uFEFF${lines.join("\r\n")}`;
}

export function downloadCsv(calc: ProjectCalc, projectName: string): void {
  const csv = buildEstimateCsv(calc);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName.replace(/[^\wа-яА-ЯёЁ\d-]+/gi, "_")}_смета.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
