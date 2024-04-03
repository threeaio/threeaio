import { Container, Graphics } from "pixi.js";
import { Group, Pt } from "pts";
import { useGridNew } from "../../context/Grid-Context-New";
import { Dragger } from "./Dragger";
import { createEffect } from "solid-js";

type GriddlerProps = {
  stage: Container;
  start: Pt;
  end: Pt;
  dir: 1 | -1;
  linesAt: number[];
  handleEndUpdate: (pt: Pt) => void;
};

const strokeWidth = 0.5;
const strokeStyle = { width: strokeWidth, color: 0xffffff };
const strokeStyleSupport = { width: strokeWidth / 2, color: 0xffffff };

const Griddler = (props: GriddlerProps) => {
  const griddlerDistance = 10; // separate controls from the actual line
  const mainContainer = new Container();
  const mainLine = new Graphics();
  const leftSupportLine = new Graphics();
  const rightSupportLine = new Graphics();
  mainContainer.addChild(mainLine);
  mainContainer.addChild(leftSupportLine);
  mainContainer.addChild(rightSupportLine);

  if (props.handleEndUpdate) {
    const onHandleEndUpdate = (pt: Pt) => {
      const ptHere = pt.$subtract(2, griddlerDistance / -2);
      props.handleEndUpdate(ptHere);
    };
    const endDragger = Dragger({
      pt: props.end.$add(2, griddlerDistance / -2),
      stage: props.stage,
      update: onHandleEndUpdate,
      direction: "x",
    });
    mainContainer.addChild(endDragger);
  }

  const line = new Group(
    new Pt(props.start.x, props.start.y),
    new Pt(props.end.x, props.end.y),
  );

  const draw = () => {
    const lineTransformed = line
      .clone()
      .add({ x: 0, y: griddlerDistance * props.dir });
    mainLine
      .moveTo(lineTransformed[0].x, lineTransformed[0].y)
      .lineTo(lineTransformed[1].x, lineTransformed[1].y)
      .stroke(strokeStyle);

    leftSupportLine
      .moveTo(lineTransformed[0].x, lineTransformed[0].y)
      .lineTo(line[0].x, line[0].y)
      .stroke(strokeStyleSupport);

    rightSupportLine
      .moveTo(lineTransformed[1].x, lineTransformed[1].y)
      .lineTo(line[1].x, line[1].y)
      .stroke(strokeStyleSupport);
  };

  const updateWidth = (x: number) => {
    mainLine.clear();
    leftSupportLine.clear();
    rightSupportLine.clear();
    line[1].x = x;
  };

  return {
    container: mainContainer,
    draw,
    updateWidth,
  };
};

export const CornerBottomGriddler = () => {
  const [{ stadiumState }, { setStadiumNumRows }] = useGridNew();

  let width: number = 0;
  let start: Pt;
  let end: Pt;
  let linesAt: number[];
  let updateChild = (_num: number) => {};

  const handleEndUpdate = (pt: Pt) => {
    setStadiumNumRows(pt.x);
  };

  createEffect(() => {
    updateChild(stadiumState.numRows);
  });

  const setup = () => {
    width = stadiumState.numRows + stadiumState.cutOut.y;
    start = new Pt(0, width);
    end = new Pt(stadiumState.numRows, width);
    linesAt = stadiumState.rowLinesAt;

    const { container, draw, updateWidth } = Griddler({
      stage: stadiumState.mainStage!,
      start,
      end,
      linesAt,
      dir: -1,
      handleEndUpdate,
    });

    updateChild = updateWidth;

    return {
      container,
      draw,
    };
  };

  return {
    setup,
  };
};
