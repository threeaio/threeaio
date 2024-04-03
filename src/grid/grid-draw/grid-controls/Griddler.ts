import { Container, Graphics } from "pixi.js";
import { Pt } from "pts";
import { useGridNew } from "../../context/Grid-Context-New";
import { Dragger } from "./Dragger";
import { createEffect } from "solid-js";

type GriddlerProps = {
  stage: Container;
  start: Pt;
  end: Pt;
  dir: 0 | 1;
  linesAt: number[];
  handleEndUpdate: (pt: Pt) => void;
};

const radius = 1;
const strokeWidth = 0.5;
const strokeStyle = { width: strokeWidth, color: 0xffffff };

const Griddler = (props: GriddlerProps) => {
  const mainContainer = new Container();

  // to IF
  const onHandleEndUpdate = (pt: Pt) => {
    props.handleEndUpdate(pt);
  };

  const mainLine = new Graphics();

  const handle1 = Dragger({
    pt: props.end,
    stage: props.stage,
    update: onHandleEndUpdate,
  });
  mainContainer.addChild(mainLine);
  mainContainer.addChild(handle1);

  let startX = props.start.x;
  let startY = props.start.y;
  let endX = props.end.x;
  let endY = props.end.y;

  const draw = () => {
    mainLine.moveTo(startX, startY).lineTo(endX, endY).stroke(strokeStyle);
  };

  const updateWidth = (x: number) => {
    mainLine.clear();
    endX = x;
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
      dir: 0,
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
