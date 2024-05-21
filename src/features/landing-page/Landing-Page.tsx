import { Component } from "solid-js";
import { fromLandingPageState } from "./landing-page-state";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "cal-sans";
import { LogoArrows } from "@3a/grid/ui";
import { LogoAnarchy } from "../../ui/Logo-Anarchy";
import { LandingPageColors } from "./components/Landing-Page-Colors";
import { LandingPageHeadline } from "./components/Landing-Page-Headline";
import { LandingPageHeadlineSubline } from "./components/Landing-Page-Headline-Subline";

export const LandingPage: Component = () => {
  const [
    { landingPageState },
    {
      setTotalContentHeight,
      setScreenHeight,
      setTotalWidth,
      setProgress,
      setVelocity,
      setScrollDirection,
    },
  ] = fromLandingPageState;

  // lenis

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();

  lenis.on(
    "scroll",
    (e: { velocity: number; progress: number; direction: -1 | 1 }) => {
      // console.log("Lenis progress", e.progress);
      // console.log("Lenis velocity", e.velocity);
      // console.log("Lenis direction", e.direction);
      setVelocity(e.velocity);
      setProgress(e.progress);
      setScrollDirection(e.direction);
    },
  );

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // lenis end

  const setupContentResizeObserver = (el: HTMLElement) => {
    new ResizeObserver((args) => {
      const cr = args[0].contentRect;
      setTotalContentHeight(cr.height);
      setTotalWidth(cr.width);
    }).observe(el);
  };

  const setupScreenResizeObserver = (el: HTMLElement) => {
    new ResizeObserver((args) => {
      const cr = args[0].contentRect;
      setScreenHeight(cr.height);
    }).observe(el);
  };

  return (
    <div
      ref={(el) => {
        setupScreenResizeObserver(el);
        setupContentResizeObserver(el);
      }}
    >
      <div class="mx-auto max-w-[1400px] p-6">
        <div class="py-12">
          <LandingPageHeadline>Angular, Art and Anarchy</LandingPageHeadline>
          <LandingPageHeadlineSubline>
            Nikolaj Sokolowksis Creative Hub
          </LandingPageHeadlineSubline>
        </div>
      </div>
      {/*<Divider />*/}
      <div class="mx-auto max-w-[1400px] p-6">
        <h2 class="text-3a-green mb-2">Thinking about a Logo and Colors</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          <div class="p-8 bg-3a-gray-darkest flex items-center">
            <LogoArrows />
          </div>
          <div class="p-8 bg-3a-gray-darkest flex items-center">
            <LogoAnarchy />
          </div>
          <div class="p-8 bg-3a-gray-darkest flex items-center">
            <LandingPageColors />
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-[1400px] p-6">
        <h2 class="text-3a-green mb-2">Sketching a Style for this Website</h2>
        <img src="/src/assets/mood_1.jpeg" alt="mood for three-a" />
      </div>
    </div>
  );
};
