import P5 from "p5";
import {
  Component,
  createEffect,
  createMemo,
  getOwner,
  onCleanup,
  runWithOwner,
} from "solid-js";
import { useGrid } from "../../../../context/_old/_Grid-Context";
import { useCanvasControl } from "../../../../context/_old/_Canvas-Control-Context";

export const DrawGrid3D: Component = () => {
  const [{ stadiumGrid, stadiumDimensions }] = useGrid();
  const [{ controlState }, { setupControls }] = useCanvasControl();

  const contextOwner = getOwner(); // what the heck is this ??? A reactive version of THIS ???

  const scaleFactor = createMemo(() => {
    const xFactor = controlState().view.width / stadiumDimensions().x;
    const yFactor = controlState().view.height / stadiumDimensions().y;
    return Math.min(xFactor, yFactor);
  });

  const transformedStadiumGrid = createMemo(() => {
    const xOffset = (scaleFactor() * stadiumDimensions().x) / 2;
    const yOffset = (scaleFactor() * stadiumDimensions().y) / 2;
    return stadiumGrid().map((gridCell, _index) => {
      const pt1_raw = gridCell.bottomLeft;

      const pt1 = gridCell.bottomLeft
        .$multiply(scaleFactor())
        .subtract([xOffset, yOffset]);

      const pt2 = pt1_raw
        .$add(gridCell.vectorToRight)
        .multiply(scaleFactor())
        .subtract([xOffset, yOffset]);
      const pt3 = pt1_raw
        .$add(gridCell.vectorToTop)
        .multiply(scaleFactor())
        .subtract([xOffset, yOffset]);
      const pt4 = pt1_raw
        .$add(gridCell.vectorDiagonal)
        .multiply(scaleFactor())
        .subtract([xOffset, yOffset]);

      return { pt1, pt2, pt3, pt4, gridCell };
    });
  });

  const drawStadium = (p5: P5) => {
    p5.clear();

    p5.camera(
      controlState().view.x * -4,
      controlState().view.y * -4,
      1000,
      0,
      0,
      0,
      0,
      1,
      0,
    );

    const lineColor = "rgba(0, 255, 200,1)";
    const z = 0;

    transformedStadiumGrid().forEach((gridCell, _index) => {
      const { pt1, pt2, pt3, pt4 } = gridCell;

      p5.beginShape(p5.LINES);
      p5.strokeWeight(0.5);
      p5.stroke(lineColor);

      p5.vertex(pt1.x, pt1.y, z);
      p5.vertex(pt2.x, pt2.y, z);
      p5.vertex(pt1.x, pt1.y, z);
      p5.vertex(pt3.x, pt3.y, z);
      p5.vertex(pt3.x, pt3.y, z);
      p5.vertex(pt4.x, pt4.y, z);

      p5.endShape();
    });
  };

  const createSketch = (ref: HTMLDivElement) => {
    setupControls(ref);

    // createEffect(() => {
    //   console.log("controlState().view", controlState().view);
    // });

    setTimeout(() => {
      const sketch = (p5: P5) => {
        p5.setup = () => {
          const canvas = p5.createCanvas(
            controlState().view.width,
            controlState().view.height,
            p5.WEBGL,
          );
          p5.disableFriendlyErrors = false;
          canvas.parent(ref);
          p5.debugMode();
          p5.rectMode(p5.CORNER);
        };
      };
      const p5 = new P5(sketch, ref);

      runWithOwner(contextOwner, () => {
        onCleanup(() => p5.remove());
      });

      runWithOwner(contextOwner, () => {
        createEffect(
          (prev: { width: number; height: number }) => {
            if (
              prev.width == controlState().view.width &&
              prev.height == controlState().view.height
            ) {
              return prev;
            }

            console.log("resize");
            p5.resizeCanvas(
              controlState().view.width,
              controlState().view.height,
            );
            return {
              width: controlState().view.width,
              height: controlState().view.height,
            };
          },
          { width: 0, height: 0 },
        );
      });

      p5.draw = () => drawStadium(p5);
    }, 0);
  };

  return (
    <div class="max-w-full w-full h-full" ref={(el) => createSketch(el)} />
  );
};
