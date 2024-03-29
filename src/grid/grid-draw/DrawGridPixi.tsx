import { Component, createEffect, createMemo, getOwner, on } from "solid-js";
import { useGrid } from "../context/Grid-Context";
import { useCanvasControl } from "../context/Canvas-Control-Context";
import { Application, Container, Graphics } from "pixi.js";
import { Block, BlockType, SeatSprite } from "./test-block/Test-Block";
import { block5, block6, block7 } from "./test-block/Test-Data";

export const DrawGridPixi: Component = () => {
  const [{ stadiumGrid, stadiumDimensions }] = useGrid();
  const [{ controlState }, { setupControls }] = useCanvasControl();

  const contextOwner = getOwner(); // what the heck is this ??? A reactive version of THIS ???

  let currentBlockIndex = 0;

  const scaleFactor = createMemo(() => {
    const xFactor = controlState().view.width / stadiumDimensions().x;
    const yFactor = controlState().view.height / stadiumDimensions().y;
    return Math.min(xFactor, yFactor);
  });

  const transformedStadiumGrid = createMemo(() => {
    const xOffset = 0; //scaleFactor() * stadiumDimensions().x) / 2;
    const yOffset = 0; // (scaleFactor() * stadiumDimensions().y) / 2;
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

  const drawStadium = createMemo(() => {
    const xAdd = 0;
    const yAdd = 0;

    return transformedStadiumGrid().map((gridCell, _index) => {
      const { pt1, pt2, pt3, pt4 } = gridCell;
      const graphic = new Graphics()
        .moveTo(pt1.x, pt1.y)
        .lineTo(pt2.x, pt2.y)
        .lineTo(pt4.x, pt4.y)
        .lineTo(pt3.x, pt3.y)
        // .lineTo(pt1.x, pt1.y)
        .fill("rgba(255,255,255,0)")
        .stroke({ width: 1, color: "rgba(0, 255, 200,1)" })
        .on("pointerdown", (event) => {
          if (currentBlock) {
            currentBlock.setBlockTransform(gridCell, scaleFactor());
          }

          // TODO conflict with drag
          event.preventDefault();
          event.stopImmediatePropagation();
        });

      return new Container().addChild(graphic);
    });
  });

  const blocks: BlockType[] = [];
  let currentBlock: BlockType | undefined;

  createEffect(
    on(scaleFactor, () => {
      const grid = transformedStadiumGrid();
      blocks.forEach((block) => {
        const indexes = block.getConnectedGridCellIndexes();
        if (indexes !== null) {
          const connectedGridCell = grid.find(
            (g) =>
              g.gridCell.xIndex === indexes.x &&
              g.gridCell.yIndex === indexes.y,
          );
          if (connectedGridCell) {
            block.setBlockTransform(connectedGridCell, scaleFactor());
          }
        }
      });
    }),
  );

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
          block.setBlockTransform(connectedGridCell, scaleFactor());
        }
      }
    });
  });

  const createSketch = (ref: HTMLDivElement) => {
    setupControls(ref);

    setTimeout(async () => {
      const app = new Application();
      await app.init({
        backgroundAlpha: 0,
        resizeTo: ref,
        resolution: 1,
        antialias: true,
        eventMode: "dynamic",
        eventFeatures: {
          move: true,
          /** disables the global move events which can be very expensive in large scenes */
          globalMove: false,
          click: true,
          wheel: true,
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

      console.log("block.height", currentBlock.container.height);
      console.log("block.width", currentBlock.container.width);

      console.log("blocks", blocks);

      app.ticker.add((time) => {
        stage.scale = controlState().view.zoom;
        stage.position = { x: controlState().view.x, y: controlState().view.y };

        stage.removeChildren();

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
      });
    }, 0);
  };

  return (
    <>
      <div class="h-full max-w-full" ref={(el) => createSketch(el)}></div>
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
