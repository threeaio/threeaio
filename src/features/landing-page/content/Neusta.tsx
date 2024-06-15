import {onMount} from "solid-js";
import mainImgUrl from "/src/assets/failed-stadium.png";

export const Neusta = () => {
  onMount(() => {
    // gsap.to("#hero-graphic", {
    //   backgroundPosition: "center bottom -300px",
    //   force3D: true,
    //   ease: "power2",
    //   scrollTrigger: {
    //     start: "top",
    //     end: "bottom",
    //     invalidateOnRefresh: true,
    //     scrub: 0,
    //   },
    // });
  });

  return (
    <div class="h-svh px-6 md:px-0 bg-cover flex"
         style={`background-image: url(${mainImgUrl}); background-position: center bottom;`}>
      <div class="self-end pb-8 grid grid-cols-26">
        <div class="col-span-full md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5">
          <h2
            class="text-3a-white font-display uppercase text-7xl lg:text-8xl 2xl:text-[110px] leading-[.85em] xl:leading-[.85em] 2xl:leading-[.85em] mb-8">
            Fixed Typos in the{" "}
            <span class="text-3a-green">World leading Repositories</span>.
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            <div class="col-span-3 md:col-span-2 2xl:col-span-1">
              <div class="font-extralight text-sm text-3a-white py-8 md:pr-12 ">
                <p class="mb-8">
                  No &ndash; I didn´t even do that.<br/>
                  I just did my Job @ Neusta as a Senior UI-Developer.
                  During the last 1.5 Years I also led the Product-Team of a Ticketing-Software.<br/>
                  <span class="text-3a-green">
                      I have requested a Resume if you are intersted in that kind of Bullshit.
                    </span>
                </p>
              </div>
            </div>
            <div class="flex justify-end">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
