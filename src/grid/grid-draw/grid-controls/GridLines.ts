import { Container, Graphics } from "pixi.js";
import { Pt } from "pts";
import {
  DraggerRadius,
  LineDraggerDistance,
  StrokeStyleSupport,
} from "./Constants";
import { Dragger } from "./Dragger";

export const createLines = (
  lines: number[],
  stage: Container,
  allLinesContainer: Container,
  handleLineUpdate: (index: number) => (pt: Pt) => void,
) => {
  console.log("createLines called");

  allLinesContainer.removeChildren();

  lines.forEach((line, index) => {
    const LineContainer = new Container();
    const LineGraphic = new Graphics()
      .moveTo(0, 0)
      .lineTo(0, LineDraggerDistance)
      .stroke(StrokeStyleSupport);

    const lineDragger = new Dragger({
      stage: stage,
      update: handleLineUpdate(index),
      direction: "x",
    });
    lineDragger.y = DraggerRadius + LineDraggerDistance;
    LineContainer.addChild(LineGraphic);
    LineContainer.addChild(lineDragger);
    allLinesContainer.addChild(LineContainer);
  });
};
