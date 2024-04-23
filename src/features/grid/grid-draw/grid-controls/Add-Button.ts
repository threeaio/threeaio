import { Container, ContainerOptions, Rectangle } from "pixi.js";
import { PlusIconDistance, PlusIconSize } from "../../Constants";
import { fromControlState } from "@3a/canvas-control";
import { PlusIcon } from "../../grid-context/Pixi-Graphic-Contextes";
import { ThreeAPointLike } from "@3a/types";

export class AddButton extends Container {
  addIconContainerGraphic = PlusIcon();

  constructor(props: ContainerOptions | undefined) {
    super({
      cursor: "pointer",
      interactive: true,
      hitArea: new Rectangle(0, 0, PlusIconSize, PlusIconSize),
      ...props,
    });
    this.addChild(this.addIconContainerGraphic);
  }

  draw(topLeft: ThreeAPointLike, width: number, height: number) {
    const zoom = fromControlState[0].zoom();
    this.scale = {
      x: 1 / zoom,
      y: 1 / zoom,
    };
    this.x = topLeft.x + width / 2 - PlusIconSize / zoom / 2;
    this.y = topLeft.y + height + PlusIconDistance / zoom;
  }
}
