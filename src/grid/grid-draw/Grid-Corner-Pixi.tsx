import { Component, getOwner, onCleanup } from "solid-js";
import { Application } from "pixi.js";
import { CornerBottomGriddler } from "./Corner-Bottom-Griddler";
import { fromControlState } from "../context/Canvas-Control-Store";
import { fromStadiumState } from "../context/grid/Grid-Store";
import { fromPixiGlobals } from "../context/Pixi-Globals-Store";
import { setupPixiGraphicContext } from "../context/Pixi-Graphic-Contextes";
import { CornerGrid } from "./Corner-Grid";

export const DrawGridCorner: Component = () => {
  console.log("DrawGridCorner");

  const [{ stadiumState }, {}] = fromStadiumState;
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

    // TODO: whole graphic-context-shizzle maybe inside Griddler ?
    setupPixiGraphicContext();
    const bottomGriddler = new CornerBottomGriddler();
    const cornerGrid = new CornerGrid();

    stage.addChild(bottomGriddler);
    stage.addChild(cornerGrid);

    app.ticker.add((ticker) => {
      stage.scale = controlState.view.zoom;
      stage.position = {
        x: controlState.view.x,
        y: controlState.view.y,
      };

      // bottomGriddler.y = stadiumState.numRows + stadiumState.cutOut.y;
      bottomGriddler.draw();

      cornerGrid.update();
      cornerGrid.draw();
    });
  };

  return (
    <>
      <div
        class="h-full w-full max-w-full absolute"
        ref={(el) => createSketch(el)}
      ></div>
    </>
  );
};
