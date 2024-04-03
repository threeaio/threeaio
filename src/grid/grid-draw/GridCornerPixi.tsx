import { Component, createEffect } from "solid-js";
import { useCanvasControl } from "../context/Canvas-Control-Context";
import { Application } from "pixi.js";

export const DrawGridCorner: Component = () => {
  const [{ controlState }, { setupControls }] = useCanvasControl();

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

      app.ticker.add((ticker) => {
        stage.scale = controlState().view.zoom / resolution;
        stage.position = {
          x: controlState().view.x / resolution,
          y: controlState().view.y / resolution,
        };
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
