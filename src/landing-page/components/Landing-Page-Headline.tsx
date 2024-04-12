import { ParentComponent } from "solid-js";

export const LandingPageHeadline: ParentComponent = (props) => {
  return (
    <h1 class=" mb-4  [ text-5xl  md:text-6xl xl:text-8xl ] [ font-display font-light text-balance ] dark:text-white">
      {props.children}
    </h1>
  );
};
