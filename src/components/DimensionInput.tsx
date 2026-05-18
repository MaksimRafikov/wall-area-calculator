import { useEffect, useRef, useState } from "react";
import { mToMm, mmToM } from "../units";

interface DimensionInputProps {
  label: string;
  /** Значение в метрах (внутреннее хранение) */
  valueM: number;
  onChange: (valueM: number) => void;
  title?: string;
}

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function DimensionInput({ label, valueM, onChange, title }: DimensionInputProps) {
  const mm = mToMm(valueM);
  const [text, setText] = useState(() => (mm > 0 ? String(mm) : ""));
  const focused = useRef(false);

  useEffect(() => {
    if (focused.current) return;
    const display = mm > 0 ? String(mm) : "";
    setText(display);
  }, [mm]);

  return (
    <label className="field" title={title}>
      <span className="field__label">{label}</span>
      <div className="field__control">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={text}
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={() => {
            focused.current = false;
            const n = parseInt(digitsOnly(text), 10) || 0;
            setText(n > 0 ? String(n) : "");
            onChange(mmToM(n));
          }}
          onChange={(e) => {
            const next = digitsOnly(e.target.value);
            setText(next);
            onChange(mmToM(parseInt(next, 10) || 0));
          }}
        />
        <span className="field__unit">мм</span>
      </div>
    </label>
  );
}
