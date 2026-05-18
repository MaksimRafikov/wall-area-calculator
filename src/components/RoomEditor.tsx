import { createWall } from "../factories";
import type { ProjectSettings, Room } from "../types";
import { WallEditor } from "./WallEditor";

interface RoomEditorProps {
  room: Room;
  settings: ProjectSettings;
  minDeductArea: number;
  onChange: (room: Room) => void;
  onRemove: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function RoomEditor({
  room,
  settings,
  minDeductArea,
  onChange,
  onRemove,
  collapsed,
  onToggleCollapse,
}: RoomEditorProps) {
  const patch = (partial: Partial<Room>) => onChange({ ...room, ...partial });

  const updateWall = (id: string, wall: typeof room.walls[0]) => {
    patch({ walls: room.walls.map((w) => (w.id === id ? wall : w)) });
  };

  const removeWall = (id: string) => {
    patch({ walls: room.walls.filter((w) => w.id !== id) });
  };

  const addWall = () => {
    patch({ walls: [...room.walls, createWall(`Стена ${room.walls.length + 1}`)] });
  };

  return (
    <article className="room card">
      <header className="room__header">
        <button
          type="button"
          className="room__toggle"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
        >
          {collapsed ? "▸" : "▾"}
        </button>
        <input
          className="room__name"
          value={room.name}
          onChange={(e) => patch({ name: e.target.value })}
          aria-label="Название помещения"
        />
        <button type="button" className="btn-icon" onClick={onRemove} title="Удалить помещение">
          ×
        </button>
      </header>

      {!collapsed && (
        <div className="room__body">
          <div className="subsection__head">
            <h3>Стены</h3>
            <button type="button" className="btn btn--ghost btn--sm" onClick={addWall}>
              + Стена
            </button>
          </div>

          {room.walls.length === 0 ? (
            <p className="hint">Добавьте стены или создайте помещение по размерам комнаты</p>
          ) : (
            room.walls.map((w) => (
              <WallEditor
                key={w.id}
                wall={w}
                settings={settings}
                minDeductArea={minDeductArea}
                onChange={(next) => updateWall(w.id, next)}
                onRemove={() => removeWall(w.id)}
              />
            ))
          )}
        </div>
      )}
    </article>
  );
}
