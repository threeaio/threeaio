import { LandingPageSectionTitle } from "../components/Landing-Page-Section-Title";
import { LogoArrows } from "./Logo-Arrows";
import { LogoAnarchy } from "./Logo-Anarchy";
import { LandingPageColors } from "./Landing-Page-Colors";
import { onMount } from "solid-js";
import { gsap } from "gsap";

export const Triptichon = () => {
  let container: HTMLDivElement;

  onMount(() => {
    if (!container) {
      return;
    }
    const headingHere = container.querySelector(".tile-heading");
    const tilesHere = container.querySelectorAll(".tile");

    let tl = gsap.timeline({
      // yes, we can add it to an entire timeline!
      scrollTrigger: {
        trigger: container,
        preventOverlaps: true,
        pin: false, // pin the trigger element while active
        start: "top bottom", // when the top of the trigger hits the top of the viewport
        end: "bottom 80%", // end after scrolling 500px beyond the start
        scrub: 2, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
    });

    // add animations and labels to the timeline
    tl.addLabel("tiles-heading").from(headingHere, {
      y: -100,
      autoAlpha: 0,
      duration: 1,
    });
    tl.addLabel("tiles").from(tilesHere, {
      stagger: 0.9,
      scale: 0.8,
      y: -60,
      autoAlpha: 0,
      duration: 2,
    });
  });

  return (
    <div class="px-6 md:px-0">
      <div
        class="tile-container grid grid-cols-26"
        ref={(el) => (container = el)}
      >
        <div class="col-span-full md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5">
          <LandingPageSectionTitle>
            Building this Website &ndash; Thinking about a Logo and Colors
          </LandingPageSectionTitle>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            <div class="tile p-8 bg-3a-gray-darker flex items-center">
              <LogoArrows />
            </div>
            <div class="tile p-8 bg-3a-gray-darker flex items-center">
              <LogoAnarchy />
            </div>
            <div class="tile p-8 md:col-span-2 lg:col-span-1 bg-3a-gray-darker flex items-center">
              <LandingPageColors />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
