import { onMount } from "solid-js";
import { gsap } from "gsap";
import { SmallText } from "../components/SmallText";
import { HugeText } from "../components/HugeText";

export const Neusta = () => {
  let container: HTMLDivElement;

  onMount(() => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        preventOverlaps: false,
        pin: container, // pin the trigger element while active
        start: "center center", // when the top of the trigger hits the top of the viewport
        end: "85% -400px", // end after scrolling 500px beyond the start
        scrub: 2,
        anticipatePin: 0.5,
        invalidateOnRefresh: false,
        immediateRender: true,
        // markers: true,
      },
    });

    tl.addLabel("start")

      .to(
        ".contributed",
        {
          // x: -20,
          x: 800,
          blur: 10,
          autoAlpha: 0,
        },
        "<",
      )
      .from(
        ".fixed-typos",
        {
          // scale: 0.8,
          x: -200,
          width: 0,
          autoAlpha: 0,
        },
        "<.2",
      )
      .addLabel("final")
      .from(
        ".explanation",
        {
          y: 120,
          // scale: 0.8,
          autoAlpha: 0,
        },
        ">.3s",
      )
      .to(
        ".headline",
        {
          opacity: 0.2,
          // scale: 6,
          blur: 20,
          transformOrigin: "0% 100%",
        },
        "<",
      );
  });

  return (
    <div
      class="h-[600px] w-full overflow-hidden px-6 md:px-0 bg-cover flex "
      id="neusta-start"
      ref={(el) => (container = el)}
    >
      {/*style={`background-image: url(${mainImgUrl}); background-position: center bottom;`}*/}
      <div class="self-end pb-8 grid grid-cols-26">
        <div class="col-span-full md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5">
          <HugeText>
            <h2 class="headline ">
              <span class="relative inline-block overflow-visible whitespace-nowrap">
                <span class="fixed-typos inline-block  overflow-visible whitespace-nowrap">
                  Fixed Typos in the{" "}
                </span>
                <span class="contributed absolute left-0 top-0  inline-block overflow-visible whitespace-nowrap">
                  Contributed to the{" "}
                </span>
              </span>
              <br />
              <span class="inline-block  overflow-visible whitespace-nowrap">
                <span class="text-3a-green">World leading</span>
              </span>{" "}
              <span class="inline-block  overflow-visible whitespace-nowrap">
                <span class="inline-block  overflow-visible whitespace-nowrap">
                  <span class="text-3a-green">Repositories</span>
                </span>
                .
              </span>
            </h2>
          </HugeText>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            <div class="col-span-3 md:col-span-2 2xl:col-span-1">
              <div class="">
                <SmallText>
                  <p class="mb-8 explanation">
                    No, not even that.
                    <br />I just did my Job @ Neusta as a{" "}
                    <span class="whitespace-nowrap">
                      Senior Frontend-Developer,
                    </span>{" "}
                    Coach and{" "}
                    <span class="whitespace-nowrap">Product-Owner</span>
                    .
                    <br />
                    <span class="text-3a-green">More Details follow soon.</span>
                  </p>
                </SmallText>
              </div>
            </div>
            <div class="flex justify-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
