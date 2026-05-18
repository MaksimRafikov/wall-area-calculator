import { createOpening } from "../factories";
import type { ProjectSettings, Wall } from "../types";
import { DimensionInput } from "./DimensionInput";
import { OpeningEditor } from "./OpeningEditor";

interface WallEditorProps {
  wall: Wall;
  settings: ProjectSettings;
  minDeductArea: number;
  onChange: (wall: Wall) => void;
  onRemove: () => void;
}

export function WallEditor({ wall, settings, minDeductArea, onChange, onRemove }: WallEditorProps) {
  const patch = (partial: Partial<Wall>) => onChange({ ...wall, ...partial });

  const updateOpening = (id: string, opening: typeof wall.openings[0]) => {
    patch({
      openings: wall.openings.map((o) => (o.id === id ? opening : o)),
    });
  };

  const removeOpening = (id: string) => {
    patch({ openings: wall.openings.filter((o) => o.id !== id) });
  };

  const addOpening = () => {
    patch({ openings: [...wall.openings, createOpening("window", settings)] });
  };

  return (
    <div className="wall card-nested">
      <div className="wall__head">
        <input
          className="wall__label"
          placeholder="Название стены"
          value={wall.label}
          onChange={(e) => patch({ label: e.target.value })}
        />
        <button type="button" className="btn-icon" onClick={onRemove} title="Удалить стену">
          ×
        </button>
      </div>

      <div className="grid grid--wall">
        <DimensionInput
          label="Длина стены"
          valueM={wall.lengthM}
          onChange={(v) => patch({ lengthM: v })}
        />
        <DimensionInput
          label="Высота стены"
          valueM={wall.heightM}
          onChange={(v) => patch({ heightM: v })}
        />
      </div>

      <div className="subsection">
        <div className="subsection__head">
          <h4>Проёмы</h4>
          <button type="button" className="btn btn--ghost btn--sm" onClick={addOpening}>
            + Проём
          </button>
        </div>
        {wall.openings.length === 0 ? (
          <p className="hint">Нет проёмов на этой стене</p>
        ) : (
          wall.openings.map((o) => (
            <OpeningEditor
              key={o.id}
              opening={o}
              settings={settings}
              minDeductArea={minDeductArea}
              onChange={(next) => updateOpening(o.id, next)}
              onRemove={() => removeOpening(o.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
