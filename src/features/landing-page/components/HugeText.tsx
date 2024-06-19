import { ParentComponent } from "solid-js";

export const HugeText: ParentComponent = (props) => {
  return (
    <div class="text-3a-white font-display uppercase text-4xl lg:text-8xl 2xl:text-[105px] leading-[.85em] lg:leading-[.85em] 2xl:leading-[.85em] mb-8">
      {props.children}
    </div>
  );
};
