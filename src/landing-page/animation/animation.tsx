import { Component, getOwner, onCleanup } from "solid-js";
import { Application } from "pixi.js";
import { fromLandingPageState } from "../landing-page-state";
import { fromPixiGlobals } from "../../grid/context/Pixi-Globals-Store";

export const DrawAnimation: Component = () => {
  const [{}, {}] = fromLandingPageState;
  const [{}, { setMainStage, setSolidContextOwner, setPixiApp, reset }] =
    fromPixiGlobals;

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
      backgroundColor: 0x111827,
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

    app.ticker.add((ticker) => {});
  };

  return (
    <>
      <div
        class="h-screen w-screen  fixed"
        ref={(el) => createSketch(el)}
      ></div>
    </>
  );
};
