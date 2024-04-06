import { JSX, ParentComponent } from "solid-js";
import { GridOptionsNew } from "./grid-options/Grid-Options-New";

export const GridNew: ParentComponent = (props: { children?: JSX.Element }) => {
  return (
    <div class="relatve flex flex-row w-full h-full">
      <div class="h-full  flex-grow overflow-hidden relative">
        {props.children}
      </div>
      <div class="h-full flex-shrink">
        <GridOptionsNew />
      </div>
    </div>
  );
};
