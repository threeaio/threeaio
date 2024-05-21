import { ParentComponent } from "solid-js";

export const LandingPageHeadline: ParentComponent = (props) => {
  return (
    <h1 class=" [ mb-2 ]  [ text-xl   ] [ font-display font-light text-balance ] text-3a-white">
      {props.children}
    </h1>
  );
};
