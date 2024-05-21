import { ParentComponent } from "solid-js";

export const LandingPageHeadlineSubline: ParentComponent = (props) => {
  return (
    <p class="text-l font-extralight  text-pretty text-3a-paper">
      {props.children}
    </p>
  );
};
