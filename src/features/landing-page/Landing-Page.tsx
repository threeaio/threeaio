import { Component, onMount } from "solid-js";
import { fromLandingPageState } from "./landing-page-state";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { Divider } from "./components/Divider";
import { Triptichon } from "./content/Triptichon";
import { Hero } from "./content/Hero";
import { GsapBlur } from "./plugins/gsap-blur";
import { Footer } from "./content/Footer";
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
  gsap.registerPlugin(Draggable);

  GsapBlur();

  onMount(() => {
    setTimeout(() => {
      // lenis
      const lenis = new Lenis({
        syncTouch: true,
        autoResize: true,
        wheelMultiplier: 0.6,
        touchMultiplier: 0.6,
        // smoothWheel: true,
        orientation: "vertical",
        gestureOrientation: "vertical",
        // // smoothTouch: false,

        // touchMultiplier: 0.6,
      });

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
    });
  });

  // lenis end

  return (
    <div ref={(el) => {}}>
      <Hero />

      <Divider />

      <Triptichon />

      <Neusta />

      <Divider />

      {/*<PrivateStuff />*/}

      {/*<Divider />*/}

      <Footer />
    </div>
  );
};
