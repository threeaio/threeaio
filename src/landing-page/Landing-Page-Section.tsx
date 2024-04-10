import { ParentComponent } from "solid-js";

export const LandingPageSection: ParentComponent = (props) => {
  return (
    <section class="section h-screen w-screen">
      <div class="h-screen max-w-screen-xl grid items-center  px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        {props.children}
      </div>
    </section>
  );
};
