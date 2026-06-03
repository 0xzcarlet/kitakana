"use client";

import { cx } from "../utils/classes";

type SegmentedValue = number | string;

export type SegmentedOption<TValue extends SegmentedValue> = {
  label: string;
  value: TValue;
};

type BaseSegmentedControlProps<TValue extends SegmentedValue> = {
  ariaLabel: string;
  className?: string;
  options: readonly SegmentedOption<TValue>[];
  testId: string;
};

type SingleSegmentedControlProps<TValue extends SegmentedValue> =
  BaseSegmentedControlProps<TValue> & {
    mode?: "single";
    onChange: (value: TValue) => void;
    value: TValue;
  };

type MultipleSegmentedControlProps<TValue extends SegmentedValue> =
  BaseSegmentedControlProps<TValue> & {
    mode: "multiple";
    onToggle: (value: TValue) => void;
    values: ReadonlySet<TValue>;
  };

export type SegmentedControlProps<TValue extends SegmentedValue> =
  | SingleSegmentedControlProps<TValue>
  | MultipleSegmentedControlProps<TValue>;

export function SegmentedControl<TValue extends SegmentedValue>(
  props: SegmentedControlProps<TValue>,
) {
  const { ariaLabel, className, options, testId } = props;
  const isMultiple = props.mode === "multiple";

  return (
    <div
      className={cx(
        "inline-flex flex-wrap gap-2 rounded-[1.25rem] bg-bg-soft p-1 ring-1 ring-border",
        className,
      )}
      role={isMultiple ? "group" : "radiogroup"}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {options.map((option) => {
        const isSelected = isMultiple
          ? props.values.has(option.value)
          : option.value === props.value;

        return (
          <button
            key={option.value}
            type="button"
            role={isMultiple ? "checkbox" : "radio"}
            aria-checked={isSelected}
            data-testid={`${testId}-${option.value}`}
            onClick={() => {
              if (isMultiple) {
                props.onToggle(option.value);
                return;
              }
              props.onChange(option.value);
            }}
            className={cx(
              "min-h-11 rounded-2xl px-4 py-2 text-sm font-bold transition",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              isSelected
                ? "bg-primary text-text shadow-[0_8px_20px_rgba(244,174,82,0.22)]"
                : "text-text-muted hover:bg-card hover:text-text",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
