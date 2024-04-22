import { Component, createEffect, createMemo, getOwner } from "solid-js";
import { Application, Container, Graphics } from "pixi.js";
import { Block, BlockType, SeatSprite } from "./test-block/Test-Block";
import { block5, block6, block7 } from "./test-block/Test-Data";
import { ArbitLines } from "./test-block/Test-Arbit-Line";
import { ArbitAreas } from "./test-block/Arbit-Areas";
import { useGrid } from "../../../../context/_old/_Grid-Context";
import { useCanvasControl } from "../../../../context/_old/_Canvas-Control-Context";

export const DrawGridPixiCorner: Component = () => {
  const [{ stadiumGrid, stadiumDimensions, arbitCurves }] = useGrid();
  const [{ controlState }, { setupControls }] = useCanvasControl();

  const contextOwner = getOwner(); // what the heck is this ??? A reactive version of THIS ???

  const arbitLine = ArbitLines();
  const arbitAreas = ArbitAreas();

  let currentBlockIndex = 0;

  const scaleFactor = createMemo(() => {
    const xFactor = controlState().view.width / stadiumDimensions().x;
    const yFactor = controlState().view.height / stadiumDimensions().y;
    return Math.min(xFactor, yFactor);
  });

  const transformedStadiumGrid = createMemo(() => {
    return stadiumGrid().map((gridCell, _index) => {
      const pt1_raw = gridCell.bottomLeft;

      const pt1 = gridCell.bottomLeft;

      const pt2 = pt1_raw.$add(gridCell.vectorToRight);
      const pt3 = pt1_raw.$add(gridCell.vectorToTop);
      const pt4 = pt1_raw.$add(gridCell.vectorDiagonal);

      return { pt1, pt2, pt3, pt4, gridCell };
    });
  });

  const drawStadium = createMemo(() => {
    return transformedStadiumGrid().map((gridCell, _index) => {
      const { pt1, pt2, pt3, pt4 } = gridCell;
      const graphic = new Graphics()
        .moveTo(pt1.x, pt1.y)
        .lineTo(pt2.x, pt2.y)
        .lineTo(pt4.x, pt4.y)
        .lineTo(pt3.x, pt3.y)
        // .lineTo(pt1.x, pt1.y)
        .fill("rgba(255,255,255,0)")
        .stroke({ width: 0.2, color: "rgba(0, 255, 200,1)" })
        .on("pointertap", (event) => {
          console.log("event", event);
          if (currentBlock) {
            currentBlock.setBlockTransform(gridCell);
          }
        });

      return new Container().addChild(graphic);
    });
  });

  const blocks: BlockType[] = [];
  let currentBlock: BlockType | undefined;

  createEffect(() => {
    const grid = transformedStadiumGrid();
    blocks.forEach((block) => {
      const indexes = block.getConnectedGridCellIndexes();
      if (indexes !== null) {
        const connectedGridCell = grid.find(
          (g) =>
            g.gridCell.xIndex === indexes.x && g.gridCell.yIndex === indexes.y,
        );
        if (connectedGridCell) {
          block.setBlockTransform(connectedGridCell);
        }
      }
    });
  });

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
      const block1 = Block(app, block7, "left");
      const block2 = Block(app, block6, "right");
      const block3 = Block(app, block5, "left");

      blocks.push(block1);
      blocks.push(block2);
      blocks.push(block3);

      currentBlock = blocks[currentBlockIndex];

      arbitLine.updateWorld(app.stage);

      app.ticker.add((ticker) => {
        stage.removeChildren();

        stage.scale = (scaleFactor() * controlState().view.zoom) / resolution;
        stage.position = {
          x: controlState().view.x / resolution,
          y: controlState().view.y / resolution,
        };

        // stage.addChild(arbitAreas.container);
        // arbitAreas.createLines();

        if (drawStadium().length) {
          stage.addChild(...drawStadium());
        }

        // block tests

        blocks.forEach((b) => {
          if (b.blockTransform) {
            b.container.localTransform = b.blockTransform;
          }

          b.container.children.forEach((c: Container) => {
            c.x = (c as SeatSprite).origX;
            c.y = (c as SeatSprite).origY;
          });

          //block.scale = scaleFactor();

          stage.addChild(b.container);
        });

        // arbit line test

        // if (arbitCurves().hittingArbits().length) {
        //   arbitCurves()
        //     .hittingArbits()
        //     .forEach((line) => {
        //       const line1 = new Graphics();
        //       const hitting = line;
        //       line1
        //         .moveTo(hitting[0].x, hitting[0].y)
        //         .lineTo(hitting[1].x, hitting[1].y)
        //         .stroke({ width: 0.5, color: 0xffffff })
        //         .moveTo(hitting[2].x, hitting[2].y)
        //         .lineTo(hitting[3].x, hitting[3].y)
        //         .stroke({ width: 0.5, color: 0xffffff });
        //
        //       stage.addChild(line1);
        //     });
        // }

        stage.addChild(arbitLine.container);
      });
    }, 0);
  };

  return (
    <>
      <div
        class="h-full w-full max-w-full absolute"
        ref={(el) => createSketch(el)}
      ></div>
      <div>
        <button
          class="absolute bottom-5 left-5 text-gray-400"
          onClick={() => {
            currentBlockIndex++;
            if (currentBlockIndex === blocks.length) {
              currentBlockIndex = 0;
            }
            currentBlock = blocks[currentBlockIndex];
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};
