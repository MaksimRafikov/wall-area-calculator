import { useEffect, useRef, useState } from "react";
import { m2ToMm2, mm2ToM2 } from "../units";

interface AreaMm2InputProps {
  label: string;
  /** Площадь в м² */
  valueM2: number;
  onChange: (valueM2: number) => void;
  title?: string;
}

export function AreaMm2Input({ label, valueM2, onChange, title }: AreaMm2InputProps) {
  const mm2 = m2ToMm2(valueM2);
  const [text, setText] = useState(() => (mm2 > 0 ? String(mm2) : ""));
  const focused = useRef(false);

  useEffect(() => {
    if (focused.current) return;
    setText(mm2 > 0 ? String(mm2) : "");
  }, [mm2]);

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
            const n = parseInt(text.replace(/\D/g, ""), 10) || 0;
            setText(n > 0 ? String(n) : "");
            onChange(mm2ToM2(n));
          }}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, "");
            setText(next);
            onChange(mm2ToM2(parseInt(next, 10) || 0));
          }}
        />
        <span className="field__unit">мм²</span>
      </div>
    </label>
  );
}
