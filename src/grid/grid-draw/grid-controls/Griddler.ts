import { Container, Graphics, Rectangle } from "pixi.js";
import { Group, Pt } from "pts";
import { Dragger } from "./Dragger";

type GriddlerProps = {
  stage: Container;
  start: Pt;
  end: Pt;
  dir: 1 | -1;
  linesAt: number[];
  handleEndUpdate: (pt: Pt) => void;
};

// move all these to Config

const strokeWidth = 0.5;
const strokeStyle = { width: strokeWidth, color: 0xffffff };
const strokeStyleSupport = { width: strokeWidth / 2, color: 0xffffff };

const endDraggerDistance = 15;
const PlusIconSize = 20;

const HorizontalLine = () => {
  return new Graphics({ interactive: false }).moveTo(0, 0).lineTo(1, 0).stroke({
    width: strokeWidth,
    color: 0xffffff,
  });
};

const VerticalLine = () => {
  return new Graphics({ interactive: false }).moveTo(0, 0).lineTo(0, 1).stroke({
    width: strokeWidth,
    color: 0xffffff,
  });
};

const PlusIcon = () => {
  const size = PlusIconSize;
  return new Graphics({ interactive: false })
    .moveTo(0, size / 2)
    .lineTo(size, size / 2)
    .moveTo(size / 2, 0)
    .lineTo(size / 2, size)
    .stroke({
      width: strokeWidth,
      color: 0xffffff,
    });
};

export const Griddler = (props: GriddlerProps) => {
  const griddlerDistance = 10; // separate controls from the actual line

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

  mainContainer.addChild(mainLine);
  mainContainer.addChild(leftSupportLine);
  mainContainer.addChild(rightSupportLine);
  mainContainer.addChild(addIconContainer);

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
    const griddlerDistanceScaled = griddlerDistance / 1;

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
      endDragger.x = topRight.x + endDraggerDistance / scale;
      endDragger.y = topRight.y + height / 2;
    }
  };

  // Receiver
  const updateWidth = (x: number) => {
    state.currentAlpha = 1;
    line[1].x = x;
  };

  // conditional handlers // Actors
  if (props.handleEndUpdate) {
    const onHandleEndUpdate = (pt: Pt) => {
      const scale = mainContainer.parent.scale.x;
      const griddlerDistanceScaled = griddlerDistance / 1;
      const ptHere = pt.$subtract(
        endDraggerDistance / scale,
        griddlerDistanceScaled / -2,
      );
      props.handleEndUpdate(ptHere);
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
  };
};
