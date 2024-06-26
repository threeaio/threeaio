import { LandingPageSectionTitle } from "../components/Landing-Page-Section-Title";
import { LogoArrows } from "./Logo-Arrows";
import { LogoAnarchy } from "./Logo-Anarchy";
import { LandingPageColors } from "./Landing-Page-Colors";
import { onMount } from "solid-js";
import { gsap } from "gsap";
import { HugeText } from "../components/HugeText";

export const Triptichon = () => {
  let container: HTMLDivElement;

  onMount(() => {
    if (!container) {
      return;
    }
    const headingsHere = container.querySelectorAll(".tile-heading");
    const tilesHere = container.querySelectorAll(".tile");

    let tl = gsap.timeline({
      // yes, we can add it to an entire timeline!
      scrollTrigger: {
        trigger: container,
        preventOverlaps: true,
        pin: false, // pin the trigger element while active
        start: "top 98%", // when the top of the trigger hits the top of the viewport
        end: "bottom 80%", // end after scrolling 500px beyond the start
        scrub: 2, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
    });

    // add animations and labels to the timeline
    tl.addLabel("tiles-heading").from(headingsHere, {
      y: 40,
      stagger: 0.1,
      autoAlpha: 0,
    });
    tl.addLabel("tiles").from(tilesHere, {
      stagger: 0.9,
      scale: 0.8,
      y: -60,
      autoAlpha: 0,
    });
  });

  return (
    <div class="px-6 md:px-0 pb-16">
      <div
        class="tile-container grid grid-cols-26"
        ref={(el) => (container = el)}
      >
        <div class="col-span-full md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5">
          <div class="tile-heading">
            <HugeText>
              <h2 class="tile-heading">
                Defining a Look{" "}
                <span class="whitespace-nowrap">for this Thing</span>
              </h2>
            </HugeText>
          </div>
        </div>
        <div class=" col-span-full md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5">
          <div class="tile-heading">
            <LandingPageSectionTitle>
              Thinking about a Logo (pointer-enter them) and Colors
            </LandingPageSectionTitle>
          </div>
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
