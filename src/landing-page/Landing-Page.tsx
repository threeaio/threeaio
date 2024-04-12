import { Component } from "solid-js";
import { LandingPageSection } from "./components/Landing-Page-Section";
import { LandingPageHeadline } from "./components/Landing-Page-Headline";
import { LandingPageHeadlineSubline } from "./components/Landing-Page-Headline-Subline";
import { fromLandingPageState } from "./landing-page-state";
import { DrawAnimation } from "./animation/Animation";

export const LandingPage: Component = () => {
  const [
    { landingPageState },
    {
      setTotalContentHeight,
      setScreenHeight,
      setTotalWidth,
      setYScroll,
      setScrollSpeed,
    },
  ] = fromLandingPageState;

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

    setYScroll(newPosition);

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
        class="h-screen snap-mandatory snap-y overflow-auto"
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
            <LandingPageHeadline>
              Was könnte eine Marketingstrategie sein?
            </LandingPageHeadline>
            <LandingPageHeadlineSubline>
              Ein paar Noob-Gedanken.
            </LandingPageHeadlineSubline>
          </LandingPageSection>

          <LandingPageSection>
            <LandingPageHeadline>
              Oder wie man »gutes&nbsp;Geld« macht.
            </LandingPageHeadline>
          </LandingPageSection>

          <LandingPageSection>
            <LandingPageHeadline>
              Ein spezieller Bedarf trifft auf eine spezielle Fähigkeit
            </LandingPageHeadline>
          </LandingPageSection>
        </div>
      </div>
    </div>
  );
};
