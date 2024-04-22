import { fromStadiumState } from "../context/grid/Grid-Store";
import { fromPixiGlobals } from "../context/Pixi-Globals-Store";
import { Container } from "pixi.js";
import { ReadOnlyLine } from "./grid-controls/Constants";
import { Line, Pt } from "pts";
import { fromControlState } from "../context/Canvas-Control-Store";

class Cell extends Container {
  public cellDefinition: [Pt, Pt, Pt, Pt];
  private bottomLine = ReadOnlyLine();
  private rightLine = ReadOnlyLine();

  constructor(cellDefinition: [Pt, Pt, Pt, Pt]) {
    super();
    this.cellDefinition = cellDefinition;
    this.addChild(this.bottomLine);
    this.addChild(this.rightLine);
  }

  public update(cellDefinition: [Pt, Pt, Pt, Pt]) {
    this.cellDefinition = cellDefinition;
  }

  public draw() {
    const zoom = fromControlState[0].controlState.view.zoom;

    // bottom Line
    const bottomLineAngle = this.cellDefinition[3]
      .$subtract(this.cellDefinition[0])
      .angle();
    const bottomLineMag = Line.magnitude([
      this.cellDefinition[0],
      this.cellDefinition[3],
    ]);
    this.bottomLine.position = this.cellDefinition[0];
    this.bottomLine.scale = { x: bottomLineMag, y: 0.5 / zoom };
    this.bottomLine.rotation = bottomLineAngle;

    // right Line
    const rightLineAngle = this.cellDefinition[2]
      .$subtract(this.cellDefinition[3])
      .angle();
    const rightLineMag = Line.magnitude([
      this.cellDefinition[3],
      this.cellDefinition[2],
    ]);
    this.rightLine.position = this.cellDefinition[3];
    this.rightLine.scale = { x: rightLineMag, y: 0.5 / zoom };
    this.rightLine.rotation = rightLineAngle;
  }
}

export class CornerGrid extends Container {
  getCornerCells = fromStadiumState[0].getCornerCells;
  cells: Cell[] = [];
  PG = fromPixiGlobals[0].PG;
  getCurrentOwner = fromPixiGlobals[0].getCurrentOwner;

  constructor() {
    super();
    this.update();
  }

  public update() {
    //this.removeChildren();
    const newChilds: Cell[] = [];
    this.getCornerCells().forEach((pts, index) => {
      if (this.cells[index]) {
        this.cells[index].update(pts);
      } else {
        const newCell = new Cell(pts);
        this.cells.push(newCell);
        newChilds.push(newCell);
      }
    });
    // TODO: remove unneeded
    if (newChilds.length) {
      this.addChild(...newChilds);
    }
  }

  public draw() {
    //
    this.cells.forEach((c, index) => {
      c.draw();
    });
  }
}
