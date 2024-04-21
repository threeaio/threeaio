import { Num, Pt } from "pts";
import { createEffect, runWithOwner } from "solid-js";
import { Griddler } from "./grid-controls/Griddler";
import { fromStadiumState, StadiumStateNew } from "../context/grid/Grid-Store";
import { fromPixiGlobals } from "../context/Pixi-Globals-Store";
import { Container } from "pixi.js";

export class CornerBottomGriddler extends Container {
  stadiumState: StadiumStateNew = fromStadiumState[0].stadiumState;
  setStadiumNumRows = fromStadiumState[1].setStadiumNumRows;
  updateRowLine = fromStadiumState[1].updateRowLine;
  addRowLine = fromStadiumState[1].addRowLine;

  PG = fromPixiGlobals[0].PG;
  getCurrentOwner = fromPixiGlobals[0].getCurrentOwner;
  private readonly griddler: Griddler;

  constructor() {
    super();
    const width = this.stadiumState.numRows + this.stadiumState.cutOut.y;
    const start = new Pt(0, 0);
    const end = new Pt(this.stadiumState.numRows, 0);
    const linesAt = this.stadiumState.rowLinesAt;

    this.griddler = this.getGriddler(start, end, linesAt);
    this.addChild(this.griddler);
    this.connectEffectsToGriddler();
  }

  public draw() {
    this.griddler.draw();
  }

  private setNumRowsUpdate = (newX: number) => {
    if (newX > 0) {
      this.setStadiumNumRows(newX);
    }
  };

  private setRowLinePositionByIndex = (newX: number, index: number) => {
    const _v = Num.clamp(newX, 0, this.stadiumState.numRows);
    this.updateRowLine(_v, index);
  };

  private setAddLine = () => {
    this.addRowLine(this.stadiumState.numRows / 2);
  };

  private getGriddler(start: Pt, end: Pt, linesAt: number[]) {
    return new Griddler({
      stage: this.PG.mainStage!,
      start,
      end,
      linesAt,
      dir: -1,
      handleAddElement: this.setAddLine,
      handleEndUpdate: this.setNumRowsUpdate,
      handleLineUpdate: this.setRowLinePositionByIndex,
    });
  }

  private connectEffectsToGriddler() {
    runWithOwner(this.getCurrentOwner(), () => {
      createEffect(() => {
        this.griddler.y =
          this.stadiumState.numRows + this.stadiumState.cutOut.y;
      });
      createEffect(() => {
        this.griddler.updateWidth(this.stadiumState.numRows);
      });
      createEffect(() => {
        this.griddler.updateLines(this.stadiumState.rowLinesAt);
      });
    });
  }
}
