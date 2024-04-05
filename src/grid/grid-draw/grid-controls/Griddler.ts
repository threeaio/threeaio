import { Container, Graphics, Rectangle } from "pixi.js";
import { Group, Pt } from "pts";
import { Dragger } from "./Dragger";
import {
  DraggerRadius,
  EndDraggerDistance,
  GriddlerDistance,
  HorizontalLine,
  LineDraggerDistance,
  PlusIcon,
  PlusIconSize,
  StrokeStyleSupport,
  VerticalLine,
} from "./Constants";

type GriddlerProps = {
  stage: Container;
  start: Pt;
  end: Pt;
  dir: 1 | -1;
  linesAt: number[];
  handleLineUpdate: (xNew: number, index: number) => void;
  handleAddElement?: (xNew: number) => void;
  handleEndUpdate?: (xNew: number) => void;
};

const createLines = (
  lines: number[],
  stage: Container,
  allLinesContainer: Container,
  handleLineUpdate: (index: number) => (pt: Pt) => void,
) => {
  allLinesContainer.removeChildren();

  lines.forEach((line, index) => {
    const LineContainer = new Container();
    const LineGraphic = new Graphics()
      .moveTo(0, 0)
      .lineTo(0, LineDraggerDistance)
      .stroke(StrokeStyleSupport);

    const lineDragger = Dragger({
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

export const Griddler = (props: GriddlerProps) => {
  const mainContainer = new Container({
    alpha: 0.5,
    isRenderGroup: true,
    interactive: true,
    hitArea: new Rectangle(0, 0, 1, 1),
    onmouseenter: (e) => {
      state.isHovered = true;
    },
    onmouseleave: (e) => {
      state.isHovered = false;
    },
  });

  let lines = props.linesAt;

  let endDragger: Container | undefined;

  const hoverContainer = new Container({ interactive: true, alpha: 0 });
  const hoverContainerGraphic = new Graphics();
  mainContainer.addChild(hoverContainer);
  hoverContainerGraphic.rect(0, 0, 1, 1).fill();
  hoverContainer.addChild(hoverContainerGraphic);

  const addIconContainer = new Container({ interactive: true });
  const addIconContainerGraphic = PlusIcon();
  addIconContainer.addChild(addIconContainerGraphic);

  const mainLine = HorizontalLine();
  const leftSupportLine = VerticalLine();
  const rightSupportLine = VerticalLine();

  const allLinesContainer = new Container();

  mainContainer.addChild(mainLine);
  mainContainer.addChild(leftSupportLine);
  mainContainer.addChild(rightSupportLine);
  mainContainer.addChild(addIconContainer);
  mainContainer.addChild(allLinesContainer);

  const state = {
    isHovered: false,
    currentAlpha: 0,
  };

  console.log("init");

  const line = new Group(
    new Pt(props.start.x, props.start.y),
    new Pt(props.end.x, props.end.y),
  );

  const draw = () => {
    // probably remove ?
    const scale = mainContainer.parent.scale.x;
    const griddlerDistanceScaled = GriddlerDistance / 1;

    if (state.isHovered) {
      state.currentAlpha = 1;
    }
    if (!state.isHovered) {
      state.currentAlpha = 1; // TODO;
    }

    const lineTransformed = line
      .clone()
      .add({ x: 0, y: griddlerDistanceScaled * props.dir });

    const topLeft = { x: lineTransformed[0].x, y: lineTransformed[0].y };
    const topRight = { x: lineTransformed[1].x, y: lineTransformed[1].y };
    const width = lineTransformed[1].x - lineTransformed[0].x;
    const height = griddlerDistanceScaled;

    const interActiveArea = new Rectangle(
      topLeft.x,
      topLeft.y,
      width + 10,
      height,
    );

    mainContainer.hitArea = interActiveArea;

    hoverContainerGraphic.scale = {
      x: width + 10,
      y: height,
    };
    hoverContainer.x = topLeft.x;
    hoverContainer.y = topLeft.y;

    mainLine.scale = {
      x: width,
      y: 1 / scale,
    };
    mainLine.x = topLeft.x;
    mainLine.y = topLeft.y + height;

    leftSupportLine.scale = {
      x: 1 / scale,
      y: height,
    };
    leftSupportLine.x = topLeft.x;
    leftSupportLine.y = topLeft.y;

    rightSupportLine.scale = {
      x: 1 / scale,
      y: height,
    };
    rightSupportLine.x = topRight.x;
    rightSupportLine.y = topRight.y;

    addIconContainer.scale = {
      x: 1 / scale,
      y: 1 / scale,
    };
    addIconContainer.x = topLeft.x + width / 2 - PlusIconSize / scale / 2;
    addIconContainer.y = topLeft.y + height + 2;

    if (endDragger) {
      endDragger.scale = 1 / scale;
      endDragger.x = topRight.x + EndDraggerDistance / scale;
      endDragger.y = topRight.y + height / 2;
    }
    if (allLinesContainer.children.length) {
      allLinesContainer.children.forEach((line, index) => {
        line.x = topLeft.x + lines[index];
        line.y = topRight.y;
        line.children[0].scale = { x: 1, y: scale };
        line.children[1].y = DraggerRadius + LineDraggerDistance * scale;
        // line.children[0].y = 0;
        line.scale = 1 / scale;
      });
    }
  };

  // Receiver
  const updateWidth = (x: number) => {
    state.currentAlpha = 1;
    line[1].x = x;
  };

  // Receiver
  const updateLines = (_lines: number[]) => {
    if (_lines.length !== lines.length) {
      createLines(_lines, props.stage, allLinesContainer, handleLineUpdate);
    } else {
      lines = _lines;
    }
  };

  const handleLineUpdate = (index: number) => (pt: Pt) => {
    const scale = mainContainer.parent.scale.x;
    const ptHere = pt.$subtract(0, LineDraggerDistance / scale);
    props.handleLineUpdate(ptHere.x, index);
  };

  createLines(props.linesAt, props.stage, allLinesContainer, handleLineUpdate);

  // conditional handlers // Actors
  if (typeof props.handleEndUpdate !== "undefined") {
    const onHandleEndUpdate = (pt: Pt) => {
      const scale = mainContainer.parent.scale.x;
      const griddlerDistanceScaled = GriddlerDistance / 1;
      const ptHere = pt.$subtract(EndDraggerDistance / scale, 0);
      props.handleEndUpdate!(ptHere.x);
    };

    // props.end.$add(2, griddlerDistance / -2)
    endDragger = Dragger({
      stage: props.stage,
      update: onHandleEndUpdate,
      direction: "x",
    });
    mainContainer.addChild(endDragger);
  }

  // must be last ?

  return {
    container: mainContainer,
    draw,
    updateWidth,
    updateLines,
  };
};
