import { Pt } from "pts";
import { Container, FederatedPointerEvent, Graphics } from "pixi.js";

export const Dragger = (props: {
  pt: Pt;
  stage: Container;
  update: (pt: Pt) => void;
}) => {
  const radius = 4;
  const strokeWidth = 0.5;
  const strokeStyle = { width: strokeWidth, color: 0xffffff };

  const handleContainer = new Container();

  const handle = new Graphics();
  let dragPoint = { x: 0, y: 0 };

  let dragging = false;

  handleContainer.interactive = true;
  handle
    .circle(props.pt.x, props.pt.y, radius)
    .translateTransform(radius / -2, radius / -2)
    .stroke(strokeStyle)
    .fill(0x001122);

  handleContainer.addChild(handle);
  handleContainer.on("pointerdown", (e) => onDragStart(e));

  const onDragStart = (event: FederatedPointerEvent) => {
    if (props.stage) {
      console.log("onDragStart");
      event.stopPropagation();
      event.preventDefault();

      dragging = true;
      dragPoint = event.getLocalPosition(props.stage);
      dragPoint.x -= handleContainer.x;
      dragPoint.y -= handleContainer.y;
      console.log("stage", props.stage.listenerCount("globalpointermove"));
      props.stage.on("globalpointermove", onDragMove);
      props.stage.on("pointerup", onDragStop);
      props.stage.on("pointerupoutside", onDragStop);
    }
  };

  const onDragMove = (event: FederatedPointerEvent) => {
    if (dragging) {
      event.preventDefault();
      event.stopPropagation();
      const newPoint = event.getLocalPosition(props.stage);

      // simulate one axis move
      // if (currentIndex !== 0) {
      //   dragging.x = newPoint.x - dragPoint.x;
      // }
      // dragging.y = newPoint.y - dragPoint.y;

      handleContainer.x = newPoint.x - dragPoint.x;
      handleContainer.y = newPoint.y - dragPoint.y;

      props.update(new Pt(newPoint.x, newPoint.y));
    }
  };

  const onDragStop = (event: FederatedPointerEvent) => {
    console.log("onDragStop");
    // event.preventDefault();
    // event.stopPropagation();
    if (dragging) {
      dragging = false;
      props.stage.off("globalpointermove");
      props.stage.off("pointerup");
      props.stage.off("pointerupoutside");
    }
  };

  return handleContainer;
};
