import { fromStadiumState } from "../context/grid/Grid-Store";
import { fromPixiGlobals, StrokeWidth } from "../context/Pixi-Globals-Store";
import { Container, Graphics } from "pixi.js";
import { HorizontalLine, VerticalLine } from "./grid-controls/Constants";
import { Pt } from "pts";

class Cell extends Container {
  public cellDefinition: [Pt, Pt, Pt, Pt];
  private bottomLine = HorizontalLine();
  private leftLine = VerticalLine();

  constructor(cellDefinition: [Pt, Pt, Pt, Pt]) {
    super();
    this.cellDefinition = cellDefinition;
  }

  public draw() {}
}

export class CornerGrid extends Container {
  getCornerCells = fromStadiumState[0].getCornerCells;

  PG = fromPixiGlobals[0].PG;
  getCurrentOwner = fromPixiGlobals[0].getCurrentOwner;

  constructor() {
    super();
  }

  public draw() {
    this.removeChildren();
    this.getCornerCells().forEach((pts, index) => {
      const g = new Graphics({ interactive: false })
        .moveTo(pts[0].x, pts[0].y)
        .lineTo(pts[1].x, pts[1].y)
        .lineTo(pts[2].x, pts[2].y)
        .lineTo(pts[3].x, pts[3].y)
        .lineTo(pts[0].x, pts[0].y)
        .stroke({
          width: StrokeWidth,
          color: 0x00ff99,
        });
      this.addChild(g);
    });
  }
}
