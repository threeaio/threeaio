import { Component, createEffect } from "solid-js";
import { useCanvasControl } from "../context/Canvas-Control-Context";
import { Application } from "pixi.js";
import { useGridNew } from "../context/Grid-Context-New";
import { CornerBottomGriddler } from "./grid-controls/Corner-Griddler";

export const DrawGridCorner: Component = () => {
  const [{ stadiumState }, { setMainStage }] = useGridNew();
  const [{ controlState }, { setupControls }] = useCanvasControl();
  // has to be constructed after stage is set in Store. What TODO
  const bottomGriddler = CornerBottomGriddler();
  createEffect(() => {});

  const createSketch = (ref: HTMLDivElement) => {
    setupControls(ref);

    const resolution = 1;

    setTimeout(async () => {
      const app = new Application();
      await app.init({
        backgroundAlpha: 0,
        resizeTo: ref,
        resolution: resolution,
        antialias: true,
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

      const bottomG = bottomGriddler.setup();

      stage.addChild(bottomG.container);

      app.ticker.add((ticker) => {
        stage.scale = controlState().view.zoom;
        stage.position = {
          x: controlState().view.x,
          y: controlState().view.y,
        };

        bottomG.draw();
      });
    }, 0);
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
