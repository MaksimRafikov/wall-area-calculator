import {
  DEFAULT_SETTINGS,
  isWindowKind,
  openingAreaM2,
  revealAreaM2,
} from "../calculations";
import { OPENING_KIND_LABELS } from "../constants";
import type { Opening, OpeningKind } from "../types";
import { DimensionInput } from "./DimensionInput";
import { IntegerInput } from "./IntegerInput";
import { m2ToMm2 } from "../units";

interface OpeningEditorProps {
  opening: Opening;
  minDeductArea: number;
  onChange: (opening: Opening) => void;
  onRemove: () => void;
}

export function OpeningEditor({
  opening,
  minDeductArea,
  onChange,
  onRemove,
}: OpeningEditorProps) {
  const patch = (partial: Partial<Opening>) => onChange({ ...opening, ...partial });

  const setKind = (kind: OpeningKind) => {
    onChange({
      ...opening,
      kind,
      revealDepthM: DEFAULT_SETTINGS.defaultRevealDepthM[kind],
    });
  };

  const unitArea = openingAreaM2(opening);
  const belowMin = unitArea > 0 && unitArea < minDeductArea;
  const reveal = revealAreaM2(opening);
  const revealLabel = isWindowKind(opening.kind) ? "откосы окна" : "откосы проёма";

  return (
    <div className="opening card-nested">
      <div className="opening__head">
        <select
          value={opening.kind}
          onChange={(e) => setKind(e.target.value as OpeningKind)}
          aria-label="Тип проёма"
        >
          {(Object.keys(OPENING_KIND_LABELS) as OpeningKind[]).map((k) => (
            <option key={k} value={k}>
              {OPENING_KIND_LABELS[k]}
            </option>
          ))}
        </select>
        <input
          className="opening__label"
          placeholder="Название (необяз.)"
          value={opening.label}
          onChange={(e) => patch({ label: e.target.value })}
        />
        <button type="button" className="btn-icon" onClick={onRemove} title="Удалить проём">
          ×
        </button>
      </div>

      <div className="grid grid--opening">
        <DimensionInput
          label="Ширина"
          valueM={opening.widthM}
          onChange={(v) => patch({ widthM: v })}
        />
        <DimensionInput
          label="Высота"
          valueM={opening.heightM}
          onChange={(v) => patch({ heightM: v })}
        />
        <IntegerInput
          label="Кол-во"
          value={opening.count}
          onChange={(v) => patch({ count: v })}
          unit="шт"
        />
        <DimensionInput
          label="Глубина откоса"
          valueM={opening.revealDepthM}
          onChange={(v) => patch({ revealDepthM: v })}
        />
        {opening.kind === "arch" && (
          <DimensionInput
            label="Высота прямой части"
            valueM={opening.archRectHeightM}
            onChange={(v) => patch({ archRectHeightM: v })}
            title="0 — полуарка по ширине проёма"
          />
        )}
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={opening.deduct}
          onChange={(e) => patch({ deduct: e.target.checked })}
        />
        Вычитать из чистой площади стен
      </label>
      {belowMin && opening.deduct && (
        <p className="hint hint--warn">
          Площадь проёма &lt; {m2ToMm2(minDeductArea).toLocaleString("ru-RU")} мм² — по настройкам не
          вычитается
        </p>
      )}
      {reveal > 0 && (
        <p className="hint">
          {revealLabel}:{" "}
          <strong>
            {reveal.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
            м²
          </strong>
        </p>
      )}
    </div>
  );
}
