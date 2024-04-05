import { Pt } from "pts";
import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { Dark, DraggerRadius, StrokeStyle } from "./Constants";

export const Dragger = (props: {
  stage: Container;
  update: (pt: Pt) => void;
  direction: "x" | "y" | "xy";
}) => {
  console.log("create Dragger");

  // let dragPoint = { x: 0, y: 0 };
  let dragging = false;

  const handleContainer = new Container({
    interactive: true,
    onpointerdown: (e) => onDragStart(e),
    cursor: "ew-resize",
  });

  const handle = new Graphics({ cursor: "ew-resize" })
    .circle(0, 0, DraggerRadius)
    .translateTransform(DraggerRadius / -2, DraggerRadius / -2)
    .scaleTransform(0.5, 0.5)
    .stroke(StrokeStyle)
    .fill(Dark);
  handleContainer.interactive = true;

  handleContainer.addChild(handle);

  const onDragStart = (event: FederatedPointerEvent) => {
    if (props.stage) {
      event.stopPropagation();
      event.preventDefault();

      dragging = true;

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
      props.update(new Pt(newPoint.x, newPoint.y));
    }
  };

  const onDragStop = (event: FederatedPointerEvent) => {
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
