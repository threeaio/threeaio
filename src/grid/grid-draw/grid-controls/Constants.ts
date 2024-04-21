import { Graphics } from "pixi.js";
import {
  PlusIconSize,
  StrokeWidth,
  White,
} from "../../context/Pixi-Globals-Store";
import { pixiGraphicContextGetter } from "../../context/Pixi-Graphic-Contextes";

export const HorizontalLine = () => {
  const g = new Graphics(
    pixiGraphicContextGetter.HorizontalLineGraphicContext(),
  );
  g.interactive = false;
  return g;
};

export const VerticalLine = () => {
  const g = new Graphics(pixiGraphicContextGetter.VerticalLineGraphicContext());
  g.interactive = false;
  return g;
};

export const PlusIcon = () => {
  const size = PlusIconSize;
  const g = new Graphics({ interactive: false })
    .moveTo(0, size / 2)
    .lineTo(size, size / 2)
    .moveTo(size / 2, 0)
    .lineTo(size / 2, size)
    .stroke({
      width: StrokeWidth,
      color: White,
    });
  g.interactive = false;
  return g;
};
