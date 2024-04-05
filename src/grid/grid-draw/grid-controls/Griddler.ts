import { Container, Rectangle } from "pixi.js";
import { Group, Pt } from "pts";
import {
  DraggerRadius,
  GriddlerDistance,
  LineDraggerDistance,
  PlusIconDistance,
  PlusIconSize,
} from "./Constants";
import { GridLines } from "./GridLines";
import { SupportLines } from "./SupportLines";
import { AddButton } from "./AddButton";
import { GriddlerEndDrag } from "./GriddlerEndDrag";
// import {createLines} from "./GridLines";

type GriddlerProps = {
  stage: Container;
  start: Pt;
  end: Pt;
  dir: 1 | -1;
  linesAt: number[];
  handleLineUpdate: (xNew: number, index: number) => void;
  handleAddElement?: () => void;
  handleEndUpdate?: (xNew: number) => void;
};

export const Griddler = (props: GriddlerProps) => {
  const state = {
    isHovered: false,
    currentAlpha: 1,
  };

  const mainContainer = new Container({
    alpha: 1,
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

  const supportLines = new SupportLines();

  const gridLines = new GridLines(
    props.linesAt,
    props.stage,
    (index: number) => (pt: Pt) => {
      const scale = mainContainer.parent.scale.x;
      const ptHere = pt.$subtract(0, LineDraggerDistance / scale);
      props.handleLineUpdate(ptHere.x, index);
    },
  );

  const endDragger = props.handleEndUpdate
    ? new GriddlerEndDrag(props.stage, (pt: Pt) => {
        const scale = mainContainer.parent.scale.x;
        const griddlerDistanceScaled =
          (LineDraggerDistance * 2 + DraggerRadius) / scale;
        const ptHere = pt.$subtract(griddlerDistanceScaled, 0);
        props.handleEndUpdate!(ptHere.x);
      })
    : undefined;

  const addButton = new AddButton({
    onclick: (e) => {
      props.handleAddElement!();
    },
  });

  mainContainer.addChild(supportLines);
  mainContainer.addChild(gridLines);
  mainContainer.addChild(addButton);
  if (endDragger) {
    mainContainer.addChild(endDragger);
  }

  const line = new Group(
    new Pt(props.start.x, props.start.y),
    new Pt(props.end.x, props.end.y),
  );

  const draw = () => {
    // probably remove ?
    const scale = mainContainer.parent.scale.x;

    const lineTransformed = line
      .clone()
      .add({ x: 0, y: GriddlerDistance * props.dir });

    const topLeft = { x: lineTransformed[0].x, y: lineTransformed[0].y };
    const topRight = { x: lineTransformed[1].x, y: lineTransformed[1].y };
    const width = lineTransformed[1].x - lineTransformed[0].x;
    const height = GriddlerDistance / scale;

    mainContainer.hitArea = new Rectangle(
      topLeft.x,
      topLeft.y,
      width + 10,
      height + PlusIconDistance + PlusIconSize,
    );

    addButton.draw(topLeft, width, height, scale);
    supportLines.draw(topLeft, topRight, width, height, scale);
    gridLines.draw(topLeft, topRight, scale);

    if (endDragger) {
      endDragger.draw(topRight, height, scale);
    }
  };

  // Receiver
  const updateWidth = (x: number) => {
    state.currentAlpha = 1;
    line[1].x = x;
  };

  // Receiver
  const updateLines = (_lines: number[]) => {
    if (_lines.length !== gridLines.lines.length) {
      gridLines.setNewLines(_lines);
    }
    gridLines.lines = _lines;
  };

  // must be last ?

  return {
    container: mainContainer,
    draw,
    updateWidth,
    updateLines,
  };
};
