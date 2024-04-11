import { Container } from "pixi.js";
import { VerticalLine } from "./Animation-Graphics-Contextes";
import { PointLike } from "../../grid/types/types";

export class Arrow extends Container {
  line = VerticalLine();

  constructor() {
    super();
    this.line.pivot = { x: 0, y: 0 };
    this.addChild(this.line);
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
