import { Component } from "solid-js";
import { LandingPageSection } from "./components/Landing-Page-Section";
import { LandingPageHeadline } from "./components/Landing-Page-Headline";
import { LandingPageHeadlineSubline } from "./components/Landing-Page-Headline-Subline";
import { fromLandingPageState } from "./landing-page-state";
import { DrawAnimation } from "./animation/Animation";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "cal-sans";

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

  let oldPosition = window.scrollY;
  let oldTime = Date.now();

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

  let resetTimeout: number;

  const handleContentScroll = (e: Event) => {
    const newPosition = (e.target as HTMLDivElement).scrollTop;
    const direction = newPosition > oldPosition ? "down" : "up";
    const distance = Math.abs(oldPosition - newPosition);
    const timeElapsed = e.timeStamp - oldTime;
    const speed = distance / timeElapsed;

    setProgress(newPosition);

    oldTime = e.timeStamp;
    oldPosition = newPosition;

    // setScrollSpeed(speed);
    //
    // if (resetTimeout) {
    //   clearTimeout(resetTimeout);
    // }
    //
    // resetTimeout = setTimeout(() => {
    //   setScrollSpeed(0);
    // }, 20);
  };

  const setupIntersectionObserver = (el: HTMLElement) => {
    el.removeEventListener("scroll", (e) => handleContentScroll(e));
    el.addEventListener("scroll", (e) => handleContentScroll(e));
  };

  return (
    <div
      ref={(el) => {
        setupScreenResizeObserver(el);
      }}
    >
      <DrawAnimation />
      <div
        class=""
        ref={(el) => {
          setupIntersectionObserver(el);
        }}
      >
        <div
          ref={(el) => {
            setupContentResizeObserver(el);
          }}
        >
          <LandingPageSection>
            <LandingPageHeadline>Angular, Art and Anarchy</LandingPageHeadline>
            <LandingPageHeadlineSubline>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis,
              inventore.
            </LandingPageHeadlineSubline>
          </LandingPageSection>

          <LandingPageSection>
            <LandingPageHeadline>
              Lorem ipsum dolor sit amet, consectetur.
            </LandingPageHeadline>
            <LandingPageHeadlineSubline>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid
              aperiam atque, doloribus eos exercitationem nihil possimus saepe
              sit?
            </LandingPageHeadlineSubline>
          </LandingPageSection>

          <LandingPageSection>
            <LandingPageHeadlineSubline>
              Lorem ipsum dolor sit amet.
            </LandingPageHeadlineSubline>
            <LandingPageHeadline>
              Lorem ipsum dolor sit amet, consectetur adipisicing.
            </LandingPageHeadline>
          </LandingPageSection>
        </div>
      </div>
    </div>
  );
};
