import { Pt } from "pts";
import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { DraggerRadius, DragHandle } from "./Constants";

export class Dragger extends Container {
  dragging = false;
  handle = new Graphics(DragHandle).translateTransform(
    DraggerRadius / -2,
    DraggerRadius / -2,
  );

  constructor(
    private props: {
      stage: Container;
      update: (pt: Pt) => void;
      direction: "x" | "y" | "xy";
    },
  ) {
    super({
      interactive: true,
      onpointerdown: (e) => this.onDragStart(e),
      cursor: "ew-resize",
    });

    this.addChild(this.handle);

    this.handle.cursor = "ew-resize";
    this.handle.scale = 1;
    // this.handle.
  }

  private onDragStart = (event: FederatedPointerEvent) => {
    if (this.props.stage) {
      event.stopPropagation();
      event.preventDefault();

      this.dragging = true;

      console.log("stage", this.props.stage.listenerCount("globalpointermove"));
      this.props.stage.on("globalpointermove", this.onDragMove);
      this.props.stage.on("pointerup", this.onDragStop);
      this.props.stage.on("pointerupoutside", this.onDragStop);
    }
  };

  private onDragMove = (event: FederatedPointerEvent) => {
    if (this.dragging) {
      event.preventDefault();
      event.stopPropagation();
      const newPoint = event.getLocalPosition(this.props.stage);
      this.props.update(new Pt(newPoint.x, newPoint.y));
    }
  };

  private onDragStop = (event: FederatedPointerEvent) => {
    // event.preventDefault();
    // event.stopPropagation();
    if (this.dragging) {
      this.dragging = false;
      this.props.stage.off("globalpointermove");
      this.props.stage.off("pointerup");
      this.props.stage.off("pointerupoutside");
    }
  };
}
