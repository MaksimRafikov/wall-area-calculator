import { calcProject } from "../src/calculations";
import { createVidineevskyProject } from "../src/presets/vidineevsky";

const calc = calcProject(createVidineevskyProject());
for (const r of calc.rooms) {
  console.log(
    `${r.room.name}: стены ${r.netM2.toFixed(2)} | откосы окна ${r.windowRevealM2.toFixed(2)} | проёмы ${r.openingRevealM2.toFixed(2)}`,
  );
}
console.log("---");
console.log(
  `ИТОГО: брутто ${calc.totals.grossM2.toFixed(2)}, чистая ${calc.totals.netM2.toFixed(2)}, откосы окна ${calc.totals.windowRevealM2.toFixed(2)}, откосы проёмов ${calc.totals.openingRevealM2.toFixed(2)}, всего откосов ${calc.totals.totalRevealM2.toFixed(2)}`,
);
