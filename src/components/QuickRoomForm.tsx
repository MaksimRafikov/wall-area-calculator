import { useState, type FormEvent } from "react";
import { createRectRoom } from "../factories";
import type { Room } from "../types";
import { mToMm } from "../units";
import { DimensionInput } from "./DimensionInput";

interface QuickRoomFormProps {
  onAdd: (room: Room) => void;
}

export function QuickRoomForm({ onAdd }: QuickRoomFormProps) {
  const [name, setName] = useState("Комната");
  const [lengthM, setLengthM] = useState(4);
  const [widthM, setWidthM] = useState(3);
  const [heightM, setHeightM] = useState(2.7);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onAdd(createRectRoom(name, lengthM, widthM, heightM));
  };

  return (
    <form className="quick-room card-nested" onSubmit={submit}>
      <h4>Быстрое помещение (прямоугольник)</h4>
      <p className="hint">Размеры вводятся в миллиметрах</p>
      <div className="grid grid--quick-room">
        <label className="field">
          <span className="field__label">Название</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <DimensionInput label="Длина" valueM={lengthM} onChange={setLengthM} />
        <DimensionInput label="Ширина" valueM={widthM} onChange={setWidthM} />
        <DimensionInput label="Высота" valueM={heightM} onChange={setHeightM} />
      </div>
      <button type="submit" className="btn btn--primary btn--sm">
        Создать 4 стены ({mToMm(lengthM)}×{mToMm(widthM)}×{mToMm(heightM)} мм)
      </button>
    </form>
  );
}
