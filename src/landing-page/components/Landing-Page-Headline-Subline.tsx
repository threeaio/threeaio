import { ParentComponent } from "solid-js";

export const LandingPageHeadlineSubline: ParentComponent = (props) => {
  return (
    <p class="dark:text-white text-2xl font-extralight  text-pretty">
      {props.children}
    </p>
  );
};
