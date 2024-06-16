import { onMount } from "solid-js";
import mainImgUrl from "/src/assets/failed-stadium.png";
import { gsap } from "gsap";

export const Neusta = () => {
  let container: HTMLDivElement;

  onMount(() => {
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        preventOverlaps: false,
        pin: container, // pin the trigger element while active
        start: "center center", // when the top of the trigger hits the top of the viewport
        end: "85% -30%", // end after scrolling 500px beyond the start
        scrub: 3, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
      },
    });

    let tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        preventOverlaps: false,
        pin: false,
        toggleActions: "play reverse play reverse",
        start: "top 60%",
        end: "bottom top ",
        scrub: false,
        // markers: true,
      },
    });

    tl2
      .from(
        container,
        {
          opacity: 0,
          duration: 1.6,
        },
        "",
      )
      .from(
        ".headline",
        {
          y: 100,
          duration: 0.6,
        },
        "<+.2",
      );

    tl.addLabel("start")

      .to(
        ".contributed",
        {
          delay: 0.4,
          x: 300,
          scale: 0.5,
          width: 0,
          height: 0,
          autoAlpha: 0,
        },
        "<",
      )
      .from(
        ".fixed-typos",
        {
          delay: 0.4,
          x: -3000,
          scale: 0.8,
          height: 0,
          width: 0,
          autoAlpha: 0,
        },
        "start-=.05s",
      )
      .addLabel("final")
      .from(
        ".explanation",
        {
          delay: 2,
          y: 120,
          scale: 0.8,
          autoAlpha: 0,
        },
        ">-0.5",
      )
      .to(
        ".headline",
        {
          opacity: 0.2,
          blur: 8,
          transformOrigin: "0% 0%",
        },
        "<+.1",
      )
      .to(".headline", {
        opacity: 0.2,
        delay: 0.5,
      });
  });

  return (
    <div
      class="h-svh w-full px-6 md:px-0 bg-cover flex"
      id="neusta-start"
      ref={(el) => (container = el)}
      style={`background-image: url(${mainImgUrl}); background-position: center bottom;`}
    >
      <div class="self-end pb-8 grid grid-cols-26">
        <div class="col-span-full md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5">
          <h2 class="headline text-3a-white font-display uppercase text-7xl lg:text-8xl 2xl:text-[110px] leading-[.85em] xl:leading-[.85em] 2xl:leading-[.85em] mb-8">
            <span class="inline-block overflow-visible whitespace-nowrap">
              <span class="contributed inline-block overflow-visible whitespace-nowrap">
                Contributed to the{" "}
              </span>
              <span class="fixed-typos inline-block  overflow-visible whitespace-nowrap">
                Fixed Typos in the{" "}
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
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            <div class="col-span-3 md:col-span-2 2xl:col-span-1">
              <div class="explanation font-extralight text-sm text-3a-white py-8 md:pr-12 ">
                <p class="mb-8">
                  Sorry &ndash; I didn´t even do that.
                  <br />I just did my Job @ Neusta as a{" "}
                  <span class="whitespace-nowrap">Senior UI-Developer.</span>
                  <br />
                  During the last 1.5 Years I also led a nice Product-Team,
                  developing a full-stack Event-Ticketing-Solution.
                  <br />
                  <span class="text-3a-green"></span>
                </p>
              </div>
            </div>
            <div class="flex justify-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
