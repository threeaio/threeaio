import { Container, Graphics } from "pixi.js";
import { Pt } from "pts";
import { Dragger } from "./Dragger";
import { fromControlState } from "@3a/canvas-control";
import {
  DraggerRadius,
  LineDraggerDistance,
  StrokeStyleSupport,
} from "../../Constants";

export class GriddlerSegments extends Container {
  constructor(
    public lines: number[],
    private stage: Container,
    private handleLineUpdate: (index: number) => (pt: Pt) => void,
    private dir: -1 | 1,
  ) {
    super();
    this.createLines();
  }

  public setNewLines(lines: number[]) {
    this.lines = lines;
    this.createLines();
  }

  public createLines() {
    this.removeChildren();
    this.lines.forEach((line, index) => {
      const LineContainer = new Container();
      const LineGraphic = new Graphics()
        .moveTo(0, 0)
        .lineTo(0, LineDraggerDistance)
        .stroke(StrokeStyleSupport);

      const lineDragger = new Dragger({
        stage: this.stage,
        update: this.handleLineUpdate(index),
        direction: "x",
      });

      lineDragger.y = DraggerRadius + LineDraggerDistance;
      LineContainer.addChild(LineGraphic);
      LineContainer.addChild(lineDragger);
      this.addChild(LineContainer);
    });
  }

  reset() {
    this.removeChildren();
  }

  draw(topLeft: { x: number; y: number }) {
    const scale = fromControlState[0].controlState.view.zoom;

    if (this.children.length) {
      this.children.forEach((line, index) => {
        // add update prop
        line.x = topLeft.x + this.lines[index];
        line.y = 0;
        line.rotation = this.dir > 0 ? 0 : Math.PI;
        // DraggerRadius + LineDraggerDistance; //
        line.scale = 1 / scale;
      });
    }
  }
}

// export const createLines = (

// ) => {
//   console.log("createLines called");
//
//   allLinesContainer.removeChildren();
//
//   lines.forEach((line, index) => {
//     const LineContainer = new Container();
//     const LineGraphic = new Graphics()
//       .moveTo(0, 0)
//       .lineTo(0, LineDraggerDistance)
//       .stroke(StrokeStyleSupport);
//
//     const lineDragger = new Dragger({
//       stage: stage,
//       update: handleLineUpdate(index),
//       direction: "x",
//     });
//     lineDragger.y = DraggerRadius + LineDraggerDistance;
//     LineContainer.addChild(LineGraphic);
//     LineContainer.addChild(lineDragger);
//     allLinesContainer.addChild(LineContainer);
//   });
// };
