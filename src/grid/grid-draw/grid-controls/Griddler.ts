import { Container, Graphics, Rectangle } from "pixi.js";
import { Group, Pt } from "pts";
import { Dragger } from "./Dragger";
import {
  DraggerRadius,
  GriddlerDistance,
  LineDraggerDistance,
  PlusIcon,
  PlusIconDistance,
  PlusIconSize,
} from "./Constants";
import { GridLines } from "./GridLines";
import { SupportLines } from "./SupportLines";
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

  mainContainer.addChild(supportLines);

  let endDragger: Container | undefined;

  const hoverContainer = new Container({ interactive: true, alpha: 0 });
  const hoverContainerGraphic = new Graphics();

  mainContainer.addChild(hoverContainer);
  hoverContainerGraphic.rect(0, 0, 1, 1).fill();
  hoverContainer.addChild(hoverContainerGraphic);

  const addIconContainer = new Container({
    cursor: "pointer",
    interactive: true,
    hitArea: new Rectangle(0, 0, PlusIconSize, PlusIconSize),
    onclick: (e) => {
      props.handleAddElement!();
    },
  });

  const addIconContainerGraphic = PlusIcon();
  addIconContainer.addChild(addIconContainerGraphic);

  mainContainer.addChild(addIconContainer);
  mainContainer.addChild(gridLines);

  const state = {
    isHovered: false,
    currentAlpha: 1,
  };

  const line = new Group(
    new Pt(props.start.x, props.start.y),
    new Pt(props.end.x, props.end.y),
  );

  const draw = () => {
    // probably remove ?
    const scale = mainContainer.parent.scale.x;

    if (state.isHovered) {
      state.currentAlpha = 1;
    }
    if (!state.isHovered) {
      state.currentAlpha = 1; // TODO;
    }

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

    hoverContainerGraphic.scale = {
      x: width + 10,
      y: height,
    };
    hoverContainer.x = topLeft.x;
    hoverContainer.y = topLeft.y;

    // add update prop
    addIconContainer.scale = {
      x: 1 / scale,
      y: 1 / scale,
    };
    addIconContainer.x = topLeft.x + width / 2 - PlusIconSize / scale / 2;
    addIconContainer.y = topLeft.y + height + PlusIconDistance / scale;

    supportLines.draw(topLeft, topRight, width, height, scale);

    if (endDragger) {
      // add update prop

      endDragger.x = topRight.x + DraggerRadius / scale;
      endDragger.children[0].x = LineDraggerDistance * 2;
      endDragger.y = topRight.y + height / 2;
      endDragger.scale = 1 / scale;
    }

    gridLines.draw(topLeft, topRight, scale);
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

  // conditional handlers // Actors
  if (typeof props.handleEndUpdate !== "undefined") {
    const onHandleEndUpdate = (pt: Pt) => {
      const scale = mainContainer.parent.scale.x;
      const griddlerDistanceScaled =
        (LineDraggerDistance * 2 + DraggerRadius) / scale;
      const ptHere = pt.$subtract(griddlerDistanceScaled, 0);
      props.handleEndUpdate!(ptHere.x);
    };

    endDragger = new Dragger({
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
