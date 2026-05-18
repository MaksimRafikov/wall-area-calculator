import { useEffect, useRef, useState } from "react";

interface IntegerInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  unit?: string;
  title?: string;
}

export function IntegerInput({
  label,
  value,
  onChange,
  min = 1,
  unit,
  title,
}: IntegerInputProps) {
  const [text, setText] = useState(() => (value > 0 ? String(value) : ""));
  const focused = useRef(false);

  useEffect(() => {
    if (focused.current) return;
    setText(value > 0 ? String(value) : "");
  }, [value]);

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
            const n = Math.max(min, parseInt(text.replace(/\D/g, ""), 10) || min);
            setText(String(n));
            onChange(n);
          }}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, "");
            setText(next);
            if (next === "") return;
            onChange(Math.max(min, parseInt(next, 10) || min));
          }}
        />
        {unit && <span className="field__unit">{unit}</span>}
      </div>
    </label>
  );
}
