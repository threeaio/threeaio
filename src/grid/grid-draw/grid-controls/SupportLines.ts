import { Container } from "pixi.js";
import { HorizontalLine, VerticalLine } from "./Constants";
import { PointLike } from "../../types/types";

export class SupportLines extends Container {
  mainLine = HorizontalLine();
  leftSupportLine = VerticalLine();
  rightSupportLine = VerticalLine();

  constructor() {
    super();
    this.addChild(this.mainLine);
    this.addChild(this.leftSupportLine);
    this.addChild(this.rightSupportLine);
  }

  public draw(
    topLeft: PointLike,
    topRight: PointLike,
    width: number,
    height: number,
    scale: number,
  ) {
    this.mainLine.scale = {
      x: width,
      y: 1 / scale,
    };
    this.mainLine.x = topLeft.x;
    this.mainLine.y = topLeft.y + height;

    // add update prop
    this.leftSupportLine.scale = {
      x: 1 / scale,
      y: height,
    };
    this.leftSupportLine.x = topLeft.x;
    this.leftSupportLine.y = topLeft.y;

    // add update prop
    this.rightSupportLine.scale = {
      x: 1 / scale,
      y: height,
    };
    this.rightSupportLine.x = topRight.x;
    this.rightSupportLine.y = topRight.y;
  }
}
