import { MainLogo } from "../components/Logo";
import mainImgUrl from "/src/assets/ich.jpeg";
import { onMount } from "solid-js";
import { gsap } from "gsap";
import { DrawAnimation } from "../animation/Animation";

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
  });

  return (
    <div id="hero-start">
      <div class="h-svh px-6 md:px-0">
        <div class="w-full hidden md:block">
          <div class="grid grid-cols-26 relative z-20">
            <div class="relative md:col-span-11 md:col-start-3 2xl:col-span-6 2xl:col-start-5 ">
              <div class="absolute left-0 h-4 w-px bg-3a-white"></div>
              <div class="absolute right-0 h-4 w-px bg-3a-white"></div>
            </div>
            <div class="relative md:col-span-11 2xl:col-span-6">
              <div class="absolute right-0 h-4 w-px bg-3a-white"></div>
            </div>
            <div class="relative md:hidden 2xl:block 2xl:col-span-6">
              <div class="absolute right-0 h-4 w-px bg-3a-white"></div>
            </div>
          </div>
        </div>
        <div class="w-full h-full grid grid-cols-26">
          {/*grid grid-cols-subgrid*/}
          <div class="col-span-full md:col-span-11 md:col-start-3 2xl:col-span-6 2xl:col-start-5 ">
            <div class="flex h-full flex-col self-end">
              <div class="">
                <MainLogo />
              </div>
              <div class="flex-1 flex">
                <div class="self-end ">
                  <div class="font-extralight text-sm text-3a-white py-16 md:pr-12 max-w-[420px]">
                    <p>
                      Hey, I'm Nikolaj! I'm trying to convince people that I'm
                      an average-to-decent programmer and that design has not
                      degenerated in my skillset.
                      <br />
                      Right now, I’m setting up this website.
                      <br />
                      <span class="text-3a-green">
                        You can scroll down for more.
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
              <DrawAnimation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
