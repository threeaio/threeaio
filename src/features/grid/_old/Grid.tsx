import { JSX, ParentComponent } from "solid-js";
import { GridOptions } from "../grid-options/_Grid-Options";
import { CanvasControlProvider } from "../../../context/_old/_Canvas-Control-Context";
import { GridProvider } from "../../../context/_old/_Grid-Context";

export const Grid: ParentComponent = (props: { children?: JSX.Element }) => {
  return (
    <CanvasControlProvider>
      <GridProvider>
        <div class="relatve flex flex-row w-full h-full">
          <div class="h-full  flex-grow overflow-hidden relative">
            {props.children}
          </div>
          <div class="h-full flex-shrink">
            <GridOptions />
          </div>
        </div>
      </GridProvider>
    </CanvasControlProvider>
  );
};
