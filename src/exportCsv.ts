import type { ProjectCalc } from "./types";

function fmt(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

function csvCell(value: string): string {
  if (/[;"\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function row(cells: string[]): string {
  return cells.map(csvCell).join(";");
}

export function buildEstimateCsv(calc: ProjectCalc): string {
  const lines: string[] = [];

  lines.push("=== Стены (смета по помещениям, общие стены в двух комнатах) ===");
  lines.push(row(["Помещение", "Стена", "Брутто, м²", "Вычет, м²", "Чистая, м²"]));

  for (const room of calc.rooms) {
    for (const wall of room.walls) {
      lines.push(
        row([
          room.room.name,
          wall.wall.label || "—",
          fmt(wall.grossM2),
          fmt(wall.deductM2),
          fmt(wall.netM2),
        ]),
      );
    }
    lines.push(
      row([
        `${room.room.name} — итого стены`,
        "",
        fmt(room.grossM2),
        fmt(room.deductM2),
        fmt(room.netM2),
      ]),
    );
  }

  lines.push(
    row(["ВСЕГО стены", "", fmt(calc.totals.grossM2), fmt(calc.totals.deductM2), fmt(calc.totals.netM2)]),
  );

  lines.push("");
  lines.push("=== Откосы по помещениям ===");
  lines.push(row(["Помещение", "Откосы окон, м²", "Откосы проёмов, м²", "Итого откосов, м²"]));

  for (const room of calc.rooms) {
    lines.push(
      row([
        room.room.name,
        fmt(room.windowRevealM2),
        fmt(room.openingRevealM2),
        fmt(room.totalRevealM2),
      ]),
    );
  }

  lines.push(
    row([
      "ВСЕГО откосы",
      fmt(calc.totals.windowRevealM2),
      fmt(calc.totals.openingRevealM2),
      fmt(calc.totals.totalRevealM2),
    ]),
  );

  lines.push("");
  lines.push("=== Откосы по стенам ===");
  lines.push(row(["Помещение", "Стена", "Окна, м²", "Проёмы, м²", "Σ, м²"]));

  for (const room of calc.rooms) {
    for (const wall of room.walls) {
      if (wall.totalRevealM2 <= 0) continue;
      lines.push(
        row([
          room.room.name,
          wall.wall.label || "—",
          fmt(wall.windowRevealM2),
          fmt(wall.openingRevealM2),
          fmt(wall.totalRevealM2),
        ]),
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
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
