import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { Num, Pt } from "pts";
import { useGrid } from "../../../../../context/_old/_Grid-Context";
import { ArbitLine } from "@3a/types";

export const ArbitLines = () => {
  const [{ stadiumState, stadiumDimensions }, { setStadiumState }] = useGrid();

  const container = new Container();

  let scale = 1;

  let stage: Container;
  let isStart = false;
  let dragging: Container | null = null;
  let dragPoint = { x: 0, y: 0 };
  let currentIndex: number;

  const createLine = (line: ArbitLine, index) => {
    const handle1Container = new Container();
    const handle2Container = new Container();

    console.log("createLine");

    const startScaled = line[0];
    const endScaled = line[1];
    const handle1 = new Graphics();

    const radius = 1;
    const strokeWidth = 0.5;

    handle1
      .circle(startScaled.x, startScaled.y, radius)
      .translateTransform(radius / -2, radius / -2)
      .stroke({ width: strokeWidth, color: 0xffffff })
      .fill(0x001122);

    handle1Container.interactive = true;

    handle1Container.addChild(handle1);
    handle1.on("pointerdown", (e) =>
      onDragStart(e, handle1Container, true, index),
    );

    const handle2 = new Graphics();

    handle2
      .circle(endScaled.x, endScaled.y, radius)
      .translateTransform(radius / -2, radius / -2)
      .stroke({ width: strokeWidth, color: 0xffffff })
      .fill(0x001122);
    handle2Container.interactive = true;
    handle2Container.addChild(handle2);
    handle2Container.on("pointerdown", (e) =>
      onDragStart(e, handle2Container, false, index),
    );

    container.addChild(handle1Container);
    container.addChild(handle2Container);
  };

  const onDragStart = (
    event,
    handle: Container,
    _isStart: boolean,
    index: number,
  ) => {
    console.log("onDragStart");
    event.stopPropagation();
    event.preventDefault();

    if (stage) {
      dragging = handle;
      isStart = _isStart;
      currentIndex = index;
      dragPoint = event.data.getLocalPosition(stage);
      dragPoint.x -= dragging.x;
      dragPoint.y -= dragging.y;
      console.log("stage", stage.listenerCount("globalpointermove"));
      stage.on("globalpointermove", onDragMove);
      stage.on("pointerup", onDragStop);
      stage.on("pointerupoutside", onDragStop);
    }
  };

  const onDragStop = (event: FederatedPointerEvent) => {
    console.log("onDragStop");
    // event.preventDefault();
    // event.stopPropagation();
    if (dragging) {
      // const newPoint = event.getLocalPosition(stage);
      // dragging.x = newPoint.x - dragPoint.x;
      // dragging.y = newPoint.y - dragPoint.y;

      // console.log("newPoint.x, newPoint.y", newPoint.x, newPoint.y);
      // setStadiumState(
      //   "arbitCornerLines",
      //   currentIndex,
      //   isStart ? 0 : 1,
      //   () => new Pt(newPoint.x, newPoint.y),
      // );

      dragging = null;
      stage.off("globalpointermove");
      stage.off("pointerup");
      stage.off("pointerupoutside");

      // console.log("event", dragging, event);
    }
  };

  const onDragMove = (event: FederatedPointerEvent) => {
    if (dragging !== null) {
      event.preventDefault();
      event.stopPropagation();
      const newPoint = event.getLocalPosition(stage);

      // simulate one axis move
      if (currentIndex !== 0) {
        dragging.x = newPoint.x - dragPoint.x;
      }
      dragging.y = newPoint.y - dragPoint.y;

      const startOrEndIndex = isStart ? 0 : 1;

      if (
        !Num.equals(
          newPoint.x,
          stadiumState.arbitCornerLines[currentIndex][startOrEndIndex].x,
          0.01,
        ) ||
        !Num.equals(
          newPoint.y,
          stadiumState.arbitCornerLines[currentIndex][startOrEndIndex].y,
          0.01,
        )
      ) {
        setStadiumState(
          "arbitCornerLines",
          currentIndex,
          isStart ? 0 : 1,
          () =>
            new Pt(
              currentIndex !== 0
                ? newPoint.x
                : stadiumState.arbitCornerLines[0][startOrEndIndex].x,
              newPoint.y,
            ),
        );
      }
    } else {
    }
  };

  const updateScale = (scaleFactor: number) => {
    scale = scaleFactor;
  };

  const updateWorld = (_app: Container) => {
    stage = _app;
  };

  createLine(stadiumState.arbitCornerLines[0], 0);
  createLine(stadiumState.arbitCornerLines[1], 1);

  return {
    container,
    updateScale,
    updateWorld,
  };
};
