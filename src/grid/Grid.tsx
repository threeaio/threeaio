import { JSX, ParentComponent } from "solid-js";
import { CanvasControlProvider } from "./context/Canvas-Control-Context";
import { GridProvider } from "./context/Grid-Context";
import { GridOptions } from "./grid-options/Grid-Options";

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
