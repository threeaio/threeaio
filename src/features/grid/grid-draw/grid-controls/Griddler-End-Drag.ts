import { Container, Graphics } from "pixi.js";
import { Dragger } from "./Dragger";
import { Pt } from "pts";
import { fromControlState } from "../../../../context/Canvas-Control-Store";
import {
  DraggerRadius,
  EndDraggerDistance,
  StrokeStyleSupport,
} from "../../Constants";
import { ThreeAPointLike } from "@3a/types";

export class GriddlerEndDrag extends Container {
  dragger: Dragger;
  line: Container = new Container();

  constructor(stage: Container, update: (pt: Pt) => void) {
    super();
    this.dragger = new Dragger({ stage, update, direction: "x" });

    const lineGraphic = new Graphics()
      .moveTo(0, 0)
      .lineTo(EndDraggerDistance, 0)
      .stroke(StrokeStyleSupport);

    this.line.addChild(lineGraphic);
    this.addChild(this.dragger);
    this.addChild(this.line);
    this.dragger.children[0].x = EndDraggerDistance;
  }

  draw(topRight: ThreeAPointLike, height: number) {
    const zoom = fromControlState[0].controlState.view.zoom;
    this.dragger.x = topRight.x + DraggerRadius / zoom;
    this.line.x = topRight.x;
    this.dragger.y = this.line.y = topRight.y + height / 2;
    this.dragger.scale = 1 / zoom;
    this.line.scale.y = 1 / zoom;
    this.line.scale.x = 1 / zoom;
  }
}
