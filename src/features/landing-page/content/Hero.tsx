import { MainLogo } from "../components/Logo";
import mainImgUrl from "/src/assets/ich.jpeg";
import { onMount } from "solid-js";
import { gsap } from "gsap";
import { GridIndicator } from "../components/Grid-Indicator";

export const Hero = () => {
  onMount(() => {
    gsap.to("#hero-graphic", {
      backgroundPosition: "center bottom -300px",
      force3D: true,
      ease: "power2",
      scrollTrigger: {
        start: "top",
        end: "bottom",
        invalidateOnRefresh: true,
        scrub: 0,
      },
    });

    gsap.to("#main-logo", {
      y: 300,
      force3D: true,
      ease: "power2",
      scrollTrigger: {
        start: "top",
        end: "bottom",
        invalidateOnRefresh: true,
        scrub: 0,
      },
    });
  });

  return (
    <div id="hero-start">
      <div class="h-svh px-6 md:px-0">
        <GridIndicator />
        <div class="w-full h-full grid grid-cols-26">
          {/*grid grid-cols-subgrid*/}
          <div class="col-span-full md:col-span-11 md:col-start-3 2xl:col-span-6 2xl:col-start-5 ">
            <div class="flex h-full flex-col self-end">
              <div id="main-logo">
                <MainLogo size={"normal"} />
              </div>
              <div class="flex-1 flex">
                <div class="self-end ">
                  <div class="font-extralight text-sm text-3a-white py-16 md:pr-12 max-w-[420px]">
                    <p class="mb-4">
                      I am Nikolaj, Typescript programmer from Bremen with great
                      empathy for the user, enthusiasm for design and an
                      instinct for clever solutions.
                    </p>
                    <p class="mb-4">
                      The site here is under construction and I'm currently
                      trying out things here that are rather unusual in the B2B
                      sector &ndash; my main field of work.
                    </p>
                    <p>
                      <span class="text-3a-green">
                        Scroll down for some nonsense.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="hidden md:block col-span-full md:col-span-13 2xl:col-span-16 h-full bg-3a-green">
            <div
              id="hero-graphic"
              style={`background-image: url(${mainImgUrl}); background-position: center bottom;`}
              class="h-full w-full bg-cover mix-blend-multiply"
            >
              {/*<DrawAnimation />*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
