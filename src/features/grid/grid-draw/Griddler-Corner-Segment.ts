import { Line, Pt } from "pts";
import { createEffect, runWithOwner } from "solid-js";
import { Griddler } from "./grid-controls/Griddler";
import { fromStadiumState, StadiumStateNew } from "../grid-context/Grid-Store";
import { Container } from "pixi.js";
import { fromPixiGlobals } from "@3a/pixi-globals";
import { ThreeAPointLike } from "@3a/types";

export class GriddlerCornerSegment extends Container {
  stadiumState: StadiumStateNew = fromStadiumState[0].stadiumState;
  updateSegmentColLine = fromStadiumState[1].updateSegmentColLine;

  PG = fromPixiGlobals[0].PG;
  getCurrentOwner = fromPixiGlobals[0].getCurrentOwner;
  private readonly griddler: Griddler;

  constructor(private myIndex: number) {
    super();
    // TODO ?
    const width = this.stadiumState.numRows + this.stadiumState.cutOut.y;
    const start = new Pt(0, 0);
    const end = new Pt(this.stadiumState.numRows, 0);
    const linesAt = this.stadiumState.colLinesInSegments[myIndex];

    this.griddler = this.getGriddler(start, end, linesAt);
    this.addChild(this.griddler);
    this.connectEffectsToGriddler();
  }

  public draw() {
    this.griddler.draw();
  }

  private setSegmentColLine = (
    _newX: number,
    index: number,
    origPoint: ThreeAPointLike,
  ) => {
    //const _v = Num.clamp(newX, 0, this.stadiumState.numRows);
    const thisPosition = this.griddler.position;
    // console.log("origPoint", origPoint);
    const zero = { x: 0, y: 0 };
    // const distance = magnitudeBy2Points(thisPosition, origPoint);
    // console.log("distance", distance);
    this.updateSegmentColLine(_newX, this.myIndex, index);
  };

  private getGriddler(start: Pt, end: Pt, linesAt: number[]) {
    return new Griddler({
      stage: this.PG.mainStage!,
      start,
      end,
      linesAt,
      dir: -1,
      // handleAddElement: this.setAddLine,
      handleLineUpdate: this.setSegmentColLine,
    });
  }

  private connectEffectsToGriddler() {
    runWithOwner(this.getCurrentOwner(), () => {
      createEffect(() => {
        // ALL only true for first !!!!
        this.griddler.y =
          this.stadiumState.numRows + this.stadiumState.cutOut.y;

        const endsAtX = this.stadiumState.numRows + this.stadiumState.cutOut.x;
        const endsAtY = 0;
        const ptStart = new Pt(this.griddler.x, this.griddler.y);
        const ptEnd = new Pt(endsAtX, endsAtY);
        const angle = ptEnd.$subtract(ptStart).angle();
        const magnitude = Line.magnitude([ptStart, ptEnd]);

        // this.griddler.x = 0 + magnitude;
        this.griddler.rotation = angle;
        this.griddler.updateWidth(magnitude);
      });
    });
  }
}
