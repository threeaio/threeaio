import { Component, onMount, Show } from "solid-js";
import { Pt } from "pts";

import { initFlowbite } from "flowbite";
import { useGrid } from "../../../context/_old/_Grid-Context";
import { StadiumState } from "@3a/types";
import { RighDrawer, SliderInput } from "@3a/grid/ui";

export const GridOptions: Component = () => {
  // https://github.com/themesberg/tailwind-solidjs-starter/issues/1
  onMount(() => {
    initFlowbite();
  });

  const [
    { stadiumState, stadiumDimensions },
    { setStadiumState, resetStadiumState },
  ] = useGrid();

  const reset = () => {
    resetStadiumState();
  };

  const setStadiumProp = (
    prop: keyof StadiumState,
    value: string | Pt | null,
    ptProp?: keyof Pt,
  ) => {
    const isPt = value instanceof Pt;
    let numValue = 0;
    if (!isPt) {
      numValue = value ? parseFloat(parseFloat(value).toFixed(4)) : 0;
    }
    if (!isNaN(numValue) || isPt) {
      if (!ptProp && stadiumState[prop] !== numValue) {
        setStadiumState({
          [prop]: isPt ? value : numValue,
        });
      } else if (ptProp === "x" || ptProp === "y") {
        const updated = (stadiumState[prop] as Pt).clone();
        updated[ptProp] = numValue;
        setStadiumState({
          [prop]: updated,
        });
      }
    }
  };

  return (
    <div>
      <RighDrawer title="Settings">
        <div class="flex gap-3 mb-6">
          <SliderInput
            name="arbitAdditionalSplit_0"
            label="A line"
            value={stadiumState.arbitAdditionalSplit[0].offset}
            min={0}
            max={15}
            onInput={(e) =>
              setStadiumState("arbitAdditionalSplit", 0, (v) => ({
                ...v,
                offset: parseFloat(e.currentTarget.value),
              }))
            }
          />
          <SliderInput
            name="arbitAdditionalSplit_0"
            label="B line"
            value={stadiumState.arbitAdditionalSplit[1].offset}
            min={0}
            max={15}
            onInput={(e) =>
              setStadiumState("arbitAdditionalSplit", 1, (v) => ({
                ...v,
                offset: parseFloat(e.currentTarget.value),
              }))
            }
          />
        </div>
        <div class="flex gap-3 mb-6">
          <SliderInput
            name="longSideY"
            label="Long Side"
            value={stadiumState.longSide.y}
            min={0}
            max={500}
            onInput={(e) =>
              setStadiumProp("longSide", e.currentTarget.value, "y")
            }
          />
          <SliderInput
            name="shortSideX"
            label="Short Side"
            value={stadiumState.shortSide.x}
            min={0}
            max={500}
            onInput={(e) =>
              setStadiumProp("shortSide", e.currentTarget.value, "x")
            }
          />
        </div>
        <div class="flex gap-3 mb-6">
          <SliderInput
            name="shortSideY"
            label="Width"
            value={stadiumState.longSide.x}
            min={0}
            max={500}
            onInput={(e) => {
              setStadiumProp("longSide", e.currentTarget.value, "x");
              setStadiumProp("shortSide", e.currentTarget.value, "y");
            }}
          />
          <SliderInput
            name="colSize"
            label="Straight Col"
            value={stadiumState.colSize}
            min={1}
            max={100}
            onInput={(e) => {
              setStadiumProp("colSize", e.currentTarget.value);
            }}
          />
        </div>
        <div class="flex gap-3 mb-6">
          <SliderInput
            name="innerCornerShapeY"
            label="Inner Corner"
            value={stadiumState.innerCornerShape.y}
            min={0}
            max={500}
            onInput={(e) => {
              setStadiumProp("innerCornerShape", e.currentTarget.value, "y");
            }}
          />

          <SliderInput
            name="innerCornerShapeX"
            label="Inner Corner"
            value={stadiumState.innerCornerShape.x}
            min={0}
            max={500}
            onInput={(e) => {
              setStadiumProp("innerCornerShape", e.currentTarget.value, "x");
            }}
          />

          <SliderInput
            name="rowAmount"
            label="Rows"
            value={stadiumState.rowAmount}
            min={1}
            max={50}
            onInput={(e) => setStadiumProp("rowAmount", e.currentTarget.value)}
          />
        </div>

        <div class="flex gap-3 mb-6">
          <SliderInput
            name="sharpenY"
            label="Long Extension"
            value={stadiumState.sharpen.y}
            min={0}
            max={100}
            onInput={(e) => {
              setStadiumProp("sharpen", e.currentTarget.value, "y");
            }}
          />

          <SliderInput
            name="sharpenX"
            label="Short Extension"
            value={stadiumState.sharpen.x}
            min={0}
            max={100}
            onInput={(e) =>
              setStadiumProp("sharpen", e.currentTarget.value, "x")
            }
          />
        </div>

        <Show when={!stadiumState.arbitCorners}>
          <div class="flex gap-3 mb-6">
            <SliderInput
              name="angleAmount"
              label="Angle Count"
              value={stadiumState.angleAmount}
              min={1}
              max={50}
              onInput={(e) =>
                setStadiumProp("angleAmount", e.currentTarget.value)
              }
            />
            <SliderInput
              name="bezierValue"
              label="Bezier Strength"
              value={stadiumState.bezierValue}
              min={0}
              max={1}
              step={0.001}
              onInput={(e) => {
                setStadiumProp("bezierValue", e.currentTarget.value);
              }}
            />
          </div>

          <div class="flex  gap-3 mb-6">
            <SliderInput
              name="t1AngleOffset"
              label="t1AngleOffset"
              value={stadiumState.t1AngleOffset}
              min={-1}
              max={1}
              step={0.001}
              onInput={(e) => {
                setStadiumProp("t1AngleOffset", e.currentTarget.value);
              }}
            />
            <SliderInput
              name="t2AngleOffset"
              label="t2AngleOffset"
              value={stadiumState.t2AngleOffset}
              min={-1}
              max={1}
              step={0.001}
              onInput={(e) => {
                setStadiumProp("t2AngleOffset", e.currentTarget.value);
              }}
            />
          </div>
        </Show>

        <button
          type="button"
          onClick={reset}
          class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Reset
        </button>
      </RighDrawer>

      {/*t1AngleOffset*/}
      {/*t2AngleOffset*/}
    </div>
  );
};
