import { Container } from "pixi.js";
import { fromControlState } from "@3a/canvas-control";
import {
  HorizontalLine,
  VerticalLine,
} from "../../grid-context/Pixi-Graphic-Contextes";
import { ThreeAPointLike } from "@3a/types";

export class GriddlerSupportLines extends Container {
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
    topLeft: ThreeAPointLike,
    topRight: ThreeAPointLike,
    width: number,
    height: number,
  ) {
    const scale = fromControlState[0].controlState.view.zoom;

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
