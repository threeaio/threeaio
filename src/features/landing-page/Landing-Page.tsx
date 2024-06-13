import { Component, onMount } from "solid-js";
import { fromLandingPageState } from "./landing-page-state";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "cal-sans";
import { LogoArrows } from "@3a/grid/ui";
import { LogoAnarchy } from "./content/Logo-Anarchy";
import { LandingPageColors } from "./content/Landing-Page-Colors";
import { MainLogo } from "./components/Logo";

import mainImgUrl from "/src/assets/ich.jpeg";
import { Divider } from "./components/Divider";

export const LandingPage: Component = () => {
  const [
    { landingPageState },
    {
      setTotalContentHeight,
      setScreenHeight,
      setTotalWidth,
      setProgress,
      setVelocity,
      setScrollDirection,
    },
  ] = fromLandingPageState;

  // lenis

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ syncTouch: true });

  lenis.on(
    "scroll",
    (e: { velocity: number; progress: number; direction: -1 | 1 }) => {
      // console.log("Lenis progress", e.progress);
      // console.log("Lenis velocity", e.velocity);
      // console.log("Lenis direction", e.direction);
      setVelocity(e.velocity);
      setProgress(e.progress);
      setScrollDirection(e.direction);
    },
  );

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // lenis end

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

  onMount(() => {
    gsap.to("#hero-graphic", {
      backgroundPosition: "center bottom -200px",
      force3D: true,
      ease: "power2",
      scrollTrigger: {
        start: "0px",
        end: "bottom",
        invalidateOnRefresh: true,
        scrub: 0,
      },
    });

    let tl = gsap.timeline({
      // yes, we can add it to an entire timeline!
      scrollTrigger: {
        trigger: ".tile-container",
        pin: false, // pin the trigger element while active
        start: "bottom 90%", // when the top of the trigger hits the top of the viewport
        end: "bottom 75%", // end after scrolling 500px beyond the start
        scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
        snap: {
          snapTo: "labels", // snap to the closest label in the timeline
          duration: { min: 0.2, max: 3 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
          delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
          ease: "power1.inOut", // the ease of the snap animation ("power3" by default)
        },
      },
    });

    // add animations and labels to the timeline
    tl.addLabel("tiles-heading").from(".tile-heading", {
      y: -100,
      autoAlpha: 0,
    });
    tl.addLabel("tiles").from(".tile", {
      stagger: 0.3,
      scale: 0.8,
      y: -60,
      autoAlpha: 0,
    });
  });

  return (
    <div
      ref={(el) => {
        setupScreenResizeObserver(el);
        setupContentResizeObserver(el);
      }}
    >
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
              ></div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <div class="px-6 md:px-0">
        <div class="tile-container  grid grid-cols-26">
          <div class="col-span-full md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5">
            <h2 class="tile-heading font-extralight text-sm text-3a-green mb-6">
              Thinking about a Logo and Colors
            </h2>
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

      <Divider />

      {/*<div class="mx-auto max-w-[1400px] p-6">*/}
      {/*  <h2 class="text-3a-green mb-2">Sketching a Style for this Website</h2>*/}
      {/*  <img src="/src/assets/mood_1.jpeg" alt="mood for three-a" />*/}
      {/*</div>*/}
      <div style="height: 1000px"></div>
    </div>
  );
};
