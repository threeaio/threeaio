import { Component, getOwner, onCleanup } from "solid-js";
import { Application } from "pixi.js";
import { CornerBottomGriddler } from "./Corner-Bottom-Griddler";
import { fromStadiumState } from "../grid-context/Grid-Store";
import { CornerGrid } from "./Corner-Grid";
import { gsap } from "gsap";
import { fromControlState } from "@3a/canvas-control";
import { fromPixiGlobals } from "@3a/pixi-globals";
import { setupPixiGraphicContext } from "../grid-context/Pixi-Graphic-Contextes";

export const DrawGridCorner: Component = () => {
  console.log("gsap", gsap);

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
      bezierSmoothness: 1,
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
      // animation just for fun
      // gsap.to(stage.scale, {
      //   x: controlState.view.zoom,
      //   y: controlState.view.zoom,
      //   duration: 0.4,
      //   ease: "sine.out",
      // });
      // gsap.to(stage.position, {
      //   x: controlState.view.x,
      //   y: controlState.view.y,
      //   ease: "sine.out",
      //   duration: 0.4,
      // });
      stage.scale = controlState.view.zoom;

      stage.position = {
        x: controlState.view.x,
        y: controlState.view.y,
      };

      // bottomGriddler.y = stadiumState.numRows + stadiumState.cutOut.y;
      bottomGriddler.draw();

      cornerGrid.update();
      cornerGrid.draw();

      bottomGriddler.y = -stadiumState.numRows;
      cornerGrid.y = -stadiumState.numRows;
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
