import { Component, createEffect } from "solid-js";
import { Application } from "pixi.js";
import { CornerBottomGriddler } from "./Corner-Griddler";
import { fromControlState } from "../context/Canvas-Control-Store";
import { fromStadiumState } from "../context/Grid-Store";

export const DrawGridCorner: Component = () => {
  const [{}, { setMainStage }] = fromStadiumState;
  const [{ controlState }, { setupControls }] = fromControlState;
  // has to be constructed after stage is set in Store. What TODO ?
  // but also needs solid js render Context
  const bottomGriddler = CornerBottomGriddler();

  createEffect(() => {});

  const createSketch = (ref: HTMLDivElement) => {
    setupControls(ref);

    const resolution = 1;

    setTimeout(async () => {
      const app = new Application();
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

      const bottomG = bottomGriddler.setup();

      stage.addChild(bottomG.container);

      app.ticker.add((ticker) => {
        stage.scale = controlState.view.zoom;
        stage.position = {
          x: controlState.view.x,
          y: controlState.view.y,
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
