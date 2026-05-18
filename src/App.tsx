import { useEffect, useMemo, useState } from "react";
import { calcProject } from "./calculations";
import { QuickRoomForm } from "./components/QuickRoomForm";
import { ResultsTable } from "./components/ResultsTable";
import { RoomEditor } from "./components/RoomEditor";
import { downloadCsv } from "./exportCsv";
import { createRoom } from "./factories";
import type { Project } from "./types";
import { createVidineevskyProject } from "./presets/vidineevsky";
import { loadProject, saveProject } from "./storage";
import { AreaMm2Input } from "./components/AreaMm2Input";

export default function App() {
  const [project, setProject] = useState<Project>(() => loadProject());
  const [collapsedRooms, setCollapsedRooms] = useState<Record<string, boolean>>({});
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    saveProject(project);
  }, [project]);

  const calc = useMemo(() => calcProject(project), [project]);

  const updateProject = (patch: Partial<Project>) => {
    setProject((p) => ({ ...p, ...patch }));
  };

  const updateRoom = (id: string, room: typeof project.rooms[0]) => {
    updateProject({
      rooms: project.rooms.map((r) => (r.id === id ? room : r)),
    });
  };

  const removeRoom = (id: string) => {
    updateProject({ rooms: project.rooms.filter((r) => r.id !== id) });
  };

  const addRoom = (room: typeof project.rooms[0]) => {
    updateProject({ rooms: [...project.rooms, room] });
  };

  const toggleRoom = (id: string) => {
    setCollapsedRooms((c) => ({ ...c, [id]: !c[id] }));
  };

  const loadVidineevsky = () => {
    if (
      project.rooms.length > 0 &&
      !confirm("Заменить текущие данные проектом «Видинеевский»?")
    ) {
      return;
    }
    setProject(createVidineevskyProject());
    setCollapsedRooms({});
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <span className="logo" aria-hidden>
            ▣
          </span>
          <div>
            <h1>Калькулятор площади стен</h1>
            <p className="header__sub">Внутренняя отделка · мм → м² · откосы отдельно</p>
          </div>
        </div>
        <div className="header__actions">
          <button type="button" className="btn btn--ghost" onClick={loadVidineevsky}>
            Видинеевский
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setShowSettings((s) => !s)}
          >
            Настройки
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => downloadCsv(calc, project.name)}
            disabled={project.rooms.length === 0}
          >
            Экспорт CSV
          </button>
        </div>
      </header>

      <div className="summary-cards">
        <SummaryCard label="Площадь брутто" value={calc.totals.grossM2} unit="м²" />
        <SummaryCard label="Вычитаемые проёмы" value={calc.totals.deductM2} unit="м²" />
        <SummaryCard label="Чистая площадь" value={calc.totals.netM2} unit="м²" highlight />
        <SummaryCard label="Откосы окон" value={calc.totals.windowRevealM2} unit="м²" />
        <SummaryCard label="Откосы проёмов" value={calc.totals.openingRevealM2} unit="м²" />
        <SummaryCard label="Всего откосов" value={calc.totals.totalRevealM2} unit="м²" />
      </div>

      <main className="layout">
        <section className="panel panel--input">
          <div className="panel__head">
            <h2>Исходные данные</h2>
            <input
              className="project-name"
              value={project.name}
              onChange={(e) => updateProject({ name: e.target.value })}
              aria-label="Название объекта"
            />
          </div>

          {showSettings && (
            <div className="settings card-nested">
              <AreaMm2Input
                label="Мин. площадь проёма для вычета"
                valueM2={project.settings.minDeductAreaM2}
                onChange={(v) =>
                  updateProject({
                    settings: { ...project.settings, minDeductAreaM2: v },
                  })
                }
                title="Проёмы меньше этого порога не вычитаются, даже если отмечено «вычитать»"
              />
            </div>
          )}

          <QuickRoomForm onAdd={addRoom} />

          <div className="panel__toolbar">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => addRoom(createRoom(`Помещение ${project.rooms.length + 1}`))}
            >
              + Пустое помещение
            </button>
            <button type="button" className="btn btn--ghost btn--sm" onClick={loadVidineevsky}>
              Загрузить «Видинеевский»
            </button>
          </div>

          <div className="rooms-list">
            {project.rooms.map((room) => (
              <RoomEditor
                key={room.id}
                room={room}
                minDeductArea={project.settings.minDeductAreaM2}
                onChange={(next) => updateRoom(room.id, next)}
                onRemove={() => removeRoom(room.id)}
                collapsed={collapsedRooms[room.id]}
                onToggleCollapse={() => toggleRoom(room.id)}
              />
            ))}
          </div>

          <div className="future card-nested">
            <h4>Скоро</h4>
            <p className="hint">
              Загрузка схемы проекта и полуавтоматическое распознавание размеров — в следующей
              версии. Структура данных уже готова к импорту.
            </p>
            <label className="upload-stub">
              <input type="file" disabled accept="image/*,.pdf,.dwg" />
              <span>Загрузить план (недоступно в MVP)</span>
            </label>
          </div>
        </section>

        <section className="panel panel--results">
          <div className="panel__head">
            <h2>Таблица для сметы</h2>
          </div>
          <ResultsTable calc={calc} />
        </section>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className={`summary-card${highlight ? " summary-card--highlight" : ""}`}>
      <span className="summary-card__label">{label}</span>
      <span className="summary-card__value">
        {value.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <small>{unit}</small>
      </span>
    </div>
  );
}
