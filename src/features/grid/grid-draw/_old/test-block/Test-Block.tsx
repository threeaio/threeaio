import {
  Application,
  Container,
  DEG_TO_RAD,
  Graphics,
  Matrix,
  Renderer,
  Sprite,
} from "pixi.js";

import { block7 } from "./Test-Data";
import { Pt } from "pts";
import { GridCell } from "@3a/types";

export class SeatSprite extends Sprite {
  origX: number = 0;
  origY: number = 0;
}

export type BlockType = {
  container: Container;
  setBlockTransform: ({ gridCell }: { gridCell: GridCell }) => void;
  blockTransform: Matrix;
  getConnectedGridCellIndexes: () => Pt | null;
};

const upScale = 40;

export const Block: (
  app: Application<Renderer>,
  data: unknown[],
  tranformDir: "left" | "right",
) => BlockType = (
  app: Application<Renderer>,
  data: any[] = block7,
  tranformDir: "left" | "right" = "left",
) => {
  let connectedGridCellIndexes: Pt | null = null;

  const getConnectedGridCellIndexes = () => {
    return connectedGridCellIndexes;
  };

  const templateShape = new Graphics().circle(0, 0, upScale).fill(0xffffff);

  const { width, height } = templateShape;

  // const blockSelfTransform: Matrix = new Matrix(1, 0, 0, 1, 0, 0);
  const blockTransform = new Matrix(1, 0, 0, 1, 0, 0);

  const setBlockTransform = ({ gridCell }: { gridCell: GridCell }) => {
    connectedGridCellIndexes = new Pt(
      gridCell.xIndex as number,
      gridCell.yIndex as number,
    );

    const angle = gridCell.vectorToRight.angle();

    const angleBetweenBottomLeft =
      gridCell.vectorToRight.angleBetween(gridCell.vectorToTop) -
      90 * DEG_TO_RAD;

    const angleBetweenBottomRight =
      gridCell.vectorToRight.angleBetween(gridCell.rightCell!.vectorToTop) -
      90 * DEG_TO_RAD;

    const skewLeftMatrix = new Matrix(
      1,
      0,
      Math.tan(angleBetweenBottomLeft) * 1,
      1,
      0,
      0,
    );

    const skewRightMatrix = new Matrix(
      1,
      0,
      Math.tan(angleBetweenBottomRight) * 1,
      1,
      0,
      0,
    );

    if (tranformDir === "left") {
      //  - 0.25 => ADD SOME DISTANCE TO KEEP DISTANCE BETWEEN SEATS
      blockTransform
        .set(1, 0, 0, 1, 0, 0)
        .translate(0.25, container.height * -1)
        // .prepend(skewLeftMatrix)
        .rotate(angle)
        .translate(gridCell.bottomLeft.x, gridCell.bottomLeft.y);
      // .scale(scaleFactor, scaleFactor);
    } else {
      blockTransform
        .set(1, 0, 0, 1, 0, 0)
        .translate(-1 * container.width - 0.25, container.height * -1)
        // .prepend(skewRightMatrix)
        .rotate(angle)
        .translate(
          gridCell.bottomLeft.x + gridCell.vectorToRight.x,
          gridCell.bottomLeft.y + gridCell.vectorToRight.y,
        );
      // .scale(scaleFactor, scaleFactor);
    }
  };

  const renderTexture = app.renderer.generateTexture({
    target: templateShape,
    width,
    height,
  });

  app.renderer.render({
    container: templateShape,
    target: renderTexture,
    transform: new Matrix(1, 0, 0, 1, width / 2, height / 2),
  });

  templateShape.destroy(true);

  const shapes: SeatSprite[] = [];

  console.log("max localY", Math.max(...data.map((b) => b.localY)));
  console.log("max localX", Math.max(...data.map((b) => b.localX)));

  for (let i = 0; i < data.length; i++) {
    const shape = new SeatSprite(renderTexture);
    shapes[i] = shape;

    shape.origX = data[i].localX - 1; // TODO: what is real center ?
    shape.origY = (data[i].localY - 1) * 1.5;

    shape.anchor.set(0, 0);
    shape.scale = 1 / upScale / 4;
    shape.position.x = data[i].localX - 1;
    shape.position.y = (data[i].localY - 1) * 1.5;

    shape.tint = 0xffffff;
  }

  const container = new Container();
  container.addChild(...shapes);

  return {
    container,
    setBlockTransform,
    blockTransform,
    getConnectedGridCellIndexes,
  };
};
