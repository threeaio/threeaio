import { Component, getOwner, onCleanup } from "solid-js";
import { Application } from "pixi.js";
import { fromLandingPageState } from "../landing-page-state";
import { Arrow } from "./Arrow";
import { setupGraphicContext } from "./Animation-Graphics-Contextes";

import { gsap } from "gsap";
import { fromPixiGlobals } from "@3a/pixi-globals";
import { createArrayFromLength, getRandomFloat } from "@3a/utils";

export const DrawAnimation: Component = () => {
  console.log("gsap", gsap);
  const [{}, {}] = fromLandingPageState;
  const [{}, { setMainStage, setSolidContextOwner, setPixiApp, reset }] =
    fromPixiGlobals;

  const [{ landingPageState }, { setTotalContentHeight, setProgress }] =
    fromLandingPageState;

  setSolidContextOwner(getOwner());

  onCleanup(async () => {
    reset();
  });

  const createSketch = async (ref: HTMLDivElement) => {
    const resolution = 1;

    const app = new Application();

    setPixiApp(app);

    await app.init({
      resizeTo: ref,
      // 0x111827
      backgroundAlpha: 0,
      resolution: resolution,

      antialias: true,
      roundPixels: false,
      eventMode: "static",
      eventFeatures: {
        move: true,
        /** disables the global move events which can be very expensive in large scenes */
        globalMove: true,
        click: true,
        wheel: false,
      },
    });

    ref.appendChild(app.canvas);

    const stage = app.stage;

    setMainStage(stage);
    setupGraphicContext();

    const anArrFormLength = createArrayFromLength(10000);
    const arrows = anArrFormLength.map((i) => new Arrow());
    const rands = anArrFormLength.map((i) => getRandomFloat(0, 2));
    stage.addChild(...arrows);

    const Pi = Math.PI;

    app.ticker.add((ticker) => {
      arrows.forEach((a, index) => {
        a.dir = landingPageState.scrollDirection;
        const aw =
          Math.abs(landingPageState.velocity) * a.dir * rands[index] * 8;
        a.arrowWidth = aw;
        // a.rotation = 0.5 * Pi + 0.5 - Math.sin(landingPageState.velocity / 20);

        // gsap.to(a, {
        //   arrowWidth: aw,
        //   duration: 1,
        // });
        // gsap.to(a, {
        //   rotation: 0.5 * Pi + Math.sin(ticker.elapsedMS) / 5000,
        //   duration: 0.2,
        // });

        a.draw();
      });
    });
  };

  return (
    <>
      <div class="h-full w-full" ref={(el) => createSketch(el)}></div>
    </>
  );
};
