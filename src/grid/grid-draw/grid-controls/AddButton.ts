import { Container, ContainerOptions, Rectangle } from "pixi.js";
import { PlusIcon, PlusIconDistance, PlusIconSize } from "./Constants";
import { PointLike } from "../../types/types";
import { fromControlState } from "../../context/Canvas-Control-Store";

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

  draw(topLeft: PointLike, width: number, height: number) {
    const zoom = fromControlState[0].controlState.view.zoom;
    this.scale = {
      x: 1 / zoom,
      y: 1 / zoom,
    };
    this.x = topLeft.x + width / 2 - PlusIconSize / zoom / 2;
    this.y = topLeft.y + height + PlusIconDistance / zoom;
  }
}
