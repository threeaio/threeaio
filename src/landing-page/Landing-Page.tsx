import { Component } from "solid-js";
import { LandingPageSection } from "./Landing-Page-Section";

export const LandingPage: Component = () => {
  return (
    <div>
      <LandingPageSection>
        <div class="mr-auto place-self-center  lg:col-span-7">
          <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            What Marketing could be
          </h1>
        </div>
      </LandingPageSection>
      <LandingPageSection>
        <div class="mr-auto place-self-center  lg:col-span-7">
          <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
            What Marketing could be
          </h1>
        </div>
      </LandingPageSection>
    </div>
  );
};
