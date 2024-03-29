import { JSX, splitProps } from "solid-js";

type SliderInputProps = {
  name: string;
  label?: string;
  step?: number;
  value: number | undefined;
  min: number | undefined;
  max: number | undefined;
  ref?: (element: HTMLInputElement) => void;
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange?: JSX.EventHandler<HTMLInputElement, Event>;
};

export const SliderInput = (props: SliderInputProps) => {
  const [, inputProps] = splitProps(props, ["value", "label", "step"]);
  return (
    <div class="overflow-hidden flex-1">
      {props.label && (
        <label
          class=" mb-2 text-sm font-medium text-gray-900 dark:text-white truncate inline-block max-w-full"
          for={props.name}
        >
          {props.label} ({props.value})
        </label>
      )}
      <input
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        type="range"
        {...inputProps}
        id={props.name}
        step={props.step || 1}
        value={props.value || 0}
      />
    </div>
  );
};
