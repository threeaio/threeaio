import { ParentComponent } from "solid-js";

export const SmallText: ParentComponent = (props) => {
  return (
    <div class="font-extralight text-sm text-3a-white  md:pr-12 max-w-[420px]">
      {props.children}
    </div>
  );
};
