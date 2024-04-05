import { Container } from "pixi.js";
import { Dragger } from "./Dragger";
import { DraggerRadius, LineDraggerDistance } from "./Constants";
import { PointLike } from "../../types/types";
import { Pt } from "pts";

export class GriddlerEndDrag extends Container {
  // controlState: CanvasControl;
  dragger: Dragger;

  constructor(stage: Container, update: (pt: Pt) => void) {
    super();
    this.dragger = new Dragger({ stage, update, direction: "x" });
    this.addChild(this.dragger);

    // this.controlState = useCanvasControl()[0].controlState();
    // console.log("this.controlState", this.controlState);
  }

  draw(topRight: PointLike, height: number, scale: number) {
    this.dragger.x = topRight.x + DraggerRadius / scale;
    this.dragger.children[0].x = LineDraggerDistance * 2;
    this.dragger.y = topRight.y + height / 2;
    this.dragger.scale = 1 / scale;
  }
}