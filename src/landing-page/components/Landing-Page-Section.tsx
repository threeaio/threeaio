import { ParentComponent } from "solid-js";

export const LandingPageSection: ParentComponent = (props) => {
  const stuff = Array.from({ length: 12 }).map(() => {
    return (
      <span class="hidden lg:block">
        <span class="absolute h-full top-0 border-r border-1 border-dashed border-gray-900/50 dark:border-gray-600"></span>
      </span>
    );
  });
  return (
    <section class="snap-center snap-always section h-screen  mx-auto [ px-4 py-8 lg:px-16 lg:py-16 ]">
      <div class="w-full h-full  relative [ grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-3 gap-0 items-center ]  lg:border-r border-1 border-dashed border-gray-900/50 dark:border-gray-600">
        {stuff}

        <div class="max-w-8xl place-self-center relative  lg:col-span-7 lg:col-start-2">
          {props.children}
        </div>
      </div>
    </section>
  );
};
