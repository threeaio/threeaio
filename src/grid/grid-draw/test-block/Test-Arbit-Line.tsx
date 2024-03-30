import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { useGrid } from "../../context/Grid-Context";
import { ArbitLine } from "../../types/types";
import { Num, Pt } from "pts";

export const ArbitLines = () => {
  const [{ stadiumState, stadiumDimensions }, { setStadiumState }] = useGrid();

  const container = new Container();
  const handle1Container = new Container();
  const handle2Container = new Container();
  let scale = 1;

  let stage: Container;
  let isStart = false;
  let dragging: Container | null = null;
  let dragPoint = { x: 0, y: 0 };

  const createLine = (line: ArbitLine) => {
    console.log("createLine");

    const startScaled = line[0];
    const endScaled = line[1];
    const handle1 = new Graphics();

    const radius = 2;
    const strokeWidth = 0.5;
    handle1
      .circle(startScaled.x, startScaled.y, radius)
      .translateTransform(radius / -2, radius / -2)
      .stroke({ width: strokeWidth, color: 0xffffff })
      .fill(0x001122);

    handle1Container.interactive = true;

    handle1Container.addChild(handle1);
    handle1.on("pointerdown", (e) => onDragStart(e, handle1Container, true));

    const handle2 = new Graphics();

    handle2
      .circle(endScaled.x, endScaled.y, radius)
      .translateTransform(radius / -2, radius / -2)
      .stroke({ width: strokeWidth, color: 0xffffff })
      .fill(0x001122);
    handle2Container.interactive = true;
    handle2Container.addChild(handle2);
    handle2Container.on("pointerdown", (e) =>
      onDragStart(e, handle2Container, false),
    );

    container.addChild(handle1Container);
    container.addChild(handle2Container);
  };

  const onDragStart = (event, handle: Container, _isStart: boolean) => {
    console.log("onDragStart");
    event.stopPropagation();
    event.preventDefault();

    if (stage) {
      dragging = handle;
      isStart = _isStart;

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
      const newPoint = event.getLocalPosition(stage);
      dragging.x = newPoint.x - dragPoint.x;
      dragging.y = newPoint.y - dragPoint.y;

      setStadiumState(
        "arbitCornerLines",
        0,
        isStart ? 0 : 1,
        () => new Pt(newPoint.x, newPoint.y),
      );

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
      dragging.x = newPoint.x - dragPoint.x;
      dragging.y = newPoint.y - dragPoint.y;

      if (
        !Num.equals(
          newPoint.x,
          stadiumState.arbitCornerLines[0][isStart ? 0 : 1].x,
          0.01,
        ) ||
        !Num.equals(
          newPoint.y,
          stadiumState.arbitCornerLines[0][isStart ? 0 : 1].y,
          0.01,
        )
      ) {
        setStadiumState(
          "arbitCornerLines",
          0,
          isStart ? 0 : 1,
          () => new Pt(newPoint.x, newPoint.y),
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

  createLine(stadiumState.arbitCornerLines[0]);

  return {
    container,
    updateScale,
    updateWorld,
  };
};
