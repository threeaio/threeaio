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
  });

  const handle = new Graphics()
    .circle(0, 0, DraggerRadius)
    .translateTransform(DraggerRadius / -2, DraggerRadius / -2)
    .stroke(StrokeStyle)
    .fill(Dark);

  handleContainer.interactive = true;

  handleContainer.addChild(handle);

  const onDragStart = (event: FederatedPointerEvent) => {
    if (props.stage) {
      console.log("onDragStart");
      event.stopPropagation();
      event.preventDefault();

      dragging = true;
      // dragPoint = event.getLocalPosition(props.stage);
      //
      // dragPoint.x -= Math.round(handleContainer.x);
      // dragPoint.y -= Math.round(handleContainer.y);

      // console.log("dragPoint", dragPoint);

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
      newPoint.x = Math.round(newPoint.x);
      newPoint.y = Math.round(newPoint.y);

      // if (props.direction !== "y") {
      //   // handleContainer.x = newPoint.x; // - dragPoint.x;
      // }
      // if (props.direction !== "x") {
      //   // handleContainer.y = newPoint.y - dragPoint.y;
      // }

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
