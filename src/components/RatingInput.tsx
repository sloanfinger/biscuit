"use client";

import {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  MouseEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { PiStar, PiStarFill, PiStarHalfFill } from "react-icons/pi";

export default function RatingInput({
  defaultValue,
  ...props
}: Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "className" | "value" | "min" | "max" | "type" | "onChange" | "step"
>) {
  const [preview, setPreview] = useState<number>(Number(defaultValue ?? 0));
  const [value, setValue] = useState<number>(Number(defaultValue ?? 0));

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(Number(e.currentTarget.value));
    },
    [setValue],
  );

  const handleMouseUp = useCallback(() => {
    setValue(preview);
  }, [preview]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLInputElement>) => {
    const i = Number(e.currentTarget.dataset.index);
    const bounds = e.currentTarget.getBoundingClientRect();
    const midpoint = bounds.x + bounds.width / 2;
    setPreview(e.clientX < midpoint ? i + 0.5 : i + 1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPreview(value);
  }, [value]);

  const stars = useMemo(
    () =>
      new Array(5).fill(null).map((_, i) => (
        <span
          className="relative size-12 cursor-pointer text-5xl text-green-600 *:absolute"
          data-index={i}
          key={i}
          onMouseMove={handleMouseMove}
        >
          <PiStar
            style={{
              opacity: `clamp(0,calc(${String(i)} - round(up,var(--preview)) + 1),1)`,
            }}
          />
          <PiStarHalfFill
            style={{
              opacity: `calc(1 - min(round(up,(var(--preview) - (${String(i)} + 0.5)) * (var(--preview) - (${String(i)} + 0.5))),1))`,
            }}
          />
          <PiStarFill
            style={{
              opacity: `clamp(0,calc(round(down,var(--preview)) - ${String(i)}),1)`,
            }}
          />
        </span>
      )),
    [handleMouseMove],
  );

  return (
    <label className="flex flex-col items-center gap-2">
      {/* <span className="text-3xl font-serif text-white tracking-wide">Rating</span> */}
      <span
        className="flex gap-2"
        style={{
          // @ts-expect-error css variable
          "--preview": String(preview),
        }}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
      >
        {stars}
      </span>
      <span className="block text-sm font-bold uppercase tracking-widest text-green-200/75">
        {preview.toFixed(1)} / 5.0
      </span>
      <input
        className="hidden"
        max={5}
        min={0}
        name="rating"
        onChange={handleInputChange}
        required
        step={0.5}
        value={value}
        {...props}
      />
    </label>
  );
}
