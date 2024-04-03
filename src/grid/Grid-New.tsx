import { JSX, ParentComponent } from "solid-js";
import { CanvasControlProvider } from "./context/Canvas-Control-Context";
import { GridProviderNew } from "./context/Grid-Context-New";
import { GridOptionsNew } from "./grid-options/Grid-Options-New";

export const GridNew: ParentComponent = (props: { children?: JSX.Element }) => {
  return (
    <CanvasControlProvider>
      <GridProviderNew>
        <div class="relatve flex flex-row w-full h-full">
          <div class="h-full  flex-grow overflow-hidden relative">
            {props.children}
          </div>
          <div class="h-full flex-shrink">
            <GridOptionsNew />
          </div>
        </div>
      </GridProviderNew>
    </CanvasControlProvider>
  );
};
