import { MainLogo } from "../components/Logo";
import { onMount } from "solid-js";
import { GridIndicator } from "../components/Grid-Indicator";

export const Footer = () => {
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
    //
    // gsap.to("#main-logo", {
    //   y: 400,
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
    <div id="footer">
      <div class="min-h-32 px-6 md:px-0">
        <GridIndicator />
        <div class="w-full h-full grid grid-cols-26">
          <div class="col-span-13 md:col-span-11 md:col-start-3 2xl:col-span-12 2xl:col-start-5 ">
            <div class="p-8 flex h-full flex-col justify-center">
              <div>
                <MainLogo size={"small"} />
              </div>
            </div>
          </div>
          <div class="col-span-13 md:col-span-11 2xl:col-span-6  h-full">
            <div class="p-8 font-extralight text-sm text-3a-paper">
              <p class="font-normal  text-3a-white">Imprint</p>
              <p>
                Nikolaj Sokolowski
                <br />
                Am Heidbergbad 30
                <br />
                28717 Bremen
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
