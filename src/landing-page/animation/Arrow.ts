import { Container } from "pixi.js";
import { VerticalLine } from "./Animation-Graphics-Contextes";
import { PointLike } from "../../grid/types/types";

export class Arrow extends Container {
  public line = VerticalLine();

  constructor() {
    super();
    this.line.pivot = { x: 0, y: 0 };
    this.addChild(this.line);
    this.line.scale = {
      x: 0,
      y: 1,
    };
  }

  public draw(start: PointLike, width: number, scale: number) {
    this.line.scale = {
      x: width,
      y: 1 / scale,
    };
    this.line.x = start.x;
    this.line.y = start.y;
  }
}
