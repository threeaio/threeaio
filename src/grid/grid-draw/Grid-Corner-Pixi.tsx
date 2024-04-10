import { Component, getOwner, onCleanup } from "solid-js";
import { Application } from "pixi.js";
import { CornerBottomGriddler } from "./Corner-Griddler";
import { fromControlState } from "../context/Canvas-Control-Store";
import { fromStadiumState } from "../context/Grid-Store";
import { fromPixiGlobals } from "../context/Pixi-Globals-Store";

export const DrawGridCorner: Component = () => {
  console.log("DrawGridCorner");

  const [{}, {}] = fromStadiumState;
  const [{ controlState }, { setupControls }] = fromControlState;
  const [{}, { setMainStage, setSolidContextOwner, setPixiApp, reset }] =
    fromPixiGlobals;

  setSolidContextOwner(getOwner());

  onCleanup(async () => {
    reset();
  });

  const createSketch = async (ref: HTMLDivElement) => {
    setupControls(ref);

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

    const bottomGriddler = new CornerBottomGriddler();

    stage.addChild(bottomGriddler);

    app.ticker.add((ticker) => {
      stage.scale = controlState.view.zoom;
      stage.position = {
        x: controlState.view.x,
        y: controlState.view.y,
      };

      bottomGriddler.draw();
    });
  };

  return (
    <>
      Hallo
      <div
        class="h-full w-full max-w-full absolute"
        ref={(el) => createSketch(el)}
      ></div>
    </>
  );
};
