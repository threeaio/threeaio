import { Component } from "solid-js";
import { fromLandingPageState } from "./landing-page-state";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Divider } from "./components/Divider";
import { Triptichon } from "./content/Triptichon";
import { Hero } from "./content/Hero";
import { Neusta } from "./content/Neusta";

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

  gsap.registerPlugin(ScrollTrigger);

  // lenis
  const lenis = new Lenis({ syncTouch: true });

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
      <Hero />

      <Divider />

      <Triptichon />

      <Divider />

      <Neusta />
      {/*Section End*/}

      {/*<div class="mx-auto max-w-[1400px] p-6">*/}
      {/*  <h2 class="text-3a-green mb-2">Sketching a Style for this Website</h2>*/}
      {/*  <img src="/src/assets/mood_1.jpeg" alt="mood for three-a" />*/}
      {/*</div>*/}
      <div style="height: 1000px"></div>
    </div>
  );
};
