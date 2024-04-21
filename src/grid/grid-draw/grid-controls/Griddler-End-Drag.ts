import { Container } from "pixi.js";
import { Dragger } from "./Dragger";
import { PointLike } from "../../types/types";
import { Pt } from "pts";
import {
  DraggerRadius,
  EndDraggerDistance,
} from "../../context/Pixi-Globals-Store";
import { fromControlState } from "../../context/Canvas-Control-Store";

export class GriddlerEndDrag extends Container {
  dragger: Dragger;

  constructor(stage: Container, update: (pt: Pt) => void) {
    super();
    this.dragger = new Dragger({ stage, update, direction: "x" });
    this.addChild(this.dragger);
    this.dragger.children[0].x = EndDraggerDistance;
  }

  draw(topRight: PointLike, height: number) {
    const zoom = fromControlState[0].controlState.view.zoom;
    this.dragger.x = topRight.x + DraggerRadius / zoom;
    this.dragger.y = topRight.y + height / 2;
    this.dragger.scale = 1 / zoom;
  }
}
