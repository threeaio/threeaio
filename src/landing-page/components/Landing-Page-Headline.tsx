import { ParentComponent } from "solid-js";

export const LandingPageHeadline: ParentComponent = (props) => {
  return (
    <h1 class=" mb-4  [ text-xl  md:text-3xl xl:text-5xl ] [ font-display font-light text-balance ] dark:text-white">
      {props.children}
    </h1>
  );
};
