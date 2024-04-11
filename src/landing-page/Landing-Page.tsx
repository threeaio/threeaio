import { Component } from "solid-js";
import { LandingPageSection } from "./components/Landing-Page-Section";
import { LandingPageHeadline } from "./components/Landing-Page-Headline";
import { LandingPageHeadlineSubline } from "./components/Landing-Page-Headline-Subline";
import { fromLandingPageState } from "./landing-page-state";
import { DrawAnimation } from "./animation/Animation";

export const LandingPage: Component = () => {
  const [{ landingPageState }, { setTotalHeight, setYScroll, setScrollSpeed }] =
    fromLandingPageState;

  let oldPosition = window.scrollY;
  let oldTime = Date.now();

  const setupResizeObserver = (el: HTMLElement) => {
    new ResizeObserver((args) => {
      const cr = args[0].contentRect;
      setTotalHeight(cr.height);
    }).observe(el);
  };

  let resetTimeout: number;

  const handleWindowScroll = (e: Event) => {
    const newPosition = window.scrollY;
    const direction = newPosition > oldPosition ? "down" : "up";
    const distance = Math.abs(oldPosition - newPosition);
    const timeElapsed = e.timeStamp - oldTime;
    const speed = distance / timeElapsed;

    setYScroll(newPosition);
    setScrollSpeed(speed);

    // console.log(window.scrollY);
    // console.log("direction", direction);
    // console.log("distance", distance);
    // console.log("timeElapsed", timeElapsed);
    // console.log("speed", distance / timeElapsed);
    oldTime = e.timeStamp;
    oldPosition = newPosition;

    if (resetTimeout) {
      clearTimeout(resetTimeout);
    }

    resetTimeout = setTimeout(() => {
      setScrollSpeed(0);
    }, 20);
  };

  const setupIntersectionObserver = (el: HTMLElement) => {
    window.addEventListener("scroll", (e) => handleWindowScroll(e));
  };

  return (
    <div
      ref={(el) => {
        setupResizeObserver(el);
        setupIntersectionObserver(el);
      }}
    >
      <DrawAnimation />
      <LandingPageSection>
        <LandingPageHeadline>What Marketing could be.</LandingPageHeadline>
        <LandingPageHeadlineSubline>
          A noobs attempt to explain how I think money is made these days.
        </LandingPageHeadlineSubline>
      </LandingPageSection>
      <LandingPageSection>
        <LandingPageHeadlineSubline>
          First Ingredient:
        </LandingPageHeadlineSubline>
        <LandingPageHeadline>
          When a »Need« touches a »Skill«.
        </LandingPageHeadline>
      </LandingPageSection>
    </div>
  );
};
