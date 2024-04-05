import { Container, ContainerOptions, Rectangle } from "pixi.js";
import { PlusIcon, PlusIconDistance, PlusIconSize } from "./Constants";
import { PointLike } from "../../types/types";

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

  draw(topLeft: PointLike, width: number, height: number, scale: number) {
    this.scale = {
      x: 1 / scale,
      y: 1 / scale,
    };
    this.x = topLeft.x + width / 2 - PlusIconSize / scale / 2;
    this.y = topLeft.y + height + PlusIconDistance / scale;
  }
}
