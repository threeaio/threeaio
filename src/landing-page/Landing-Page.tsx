import { Component } from "solid-js";
import { LandingPageSection } from "./Landing-Page-Section";

export const LandingPage: Component = () => {
  let oldPosition = window.scrollY;
  let oldTime = Date.now();

  const setupResizeObserver = (el: HTMLElement) => {
    new ResizeObserver((args) => {
      console.log("ResizeObserver args", args);
      const cr = args[0].contentRect;
      console.log(cr.height);
    }).observe(el);
  };

  const handleWondowScroll = (e: Event) => {
    const newPosition = window.scrollY;
    const direction = newPosition > oldPosition ? "down" : "up";
    const distance = Math.abs(oldPosition - newPosition);
    const timeElapsed = e.timeStamp - oldTime;

    console.log(window.scrollY);
    console.log("direction", direction);
    // console.log("distance", distance);
    // console.log("timeElapsed", timeElapsed);
    console.log("speed", distance / timeElapsed);
    oldTime = e.timeStamp;
    oldPosition = newPosition;
  };

  const setupIntersectionObserver = (el: HTMLElement) => {
    window.addEventListener("scroll", (e) => handleWondowScroll(e));
  };

  return (
    <div
      ref={(el) => {
        setupResizeObserver(el);
        setupIntersectionObserver(el);
      }}
    >
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
