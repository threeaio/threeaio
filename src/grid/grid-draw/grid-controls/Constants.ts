import { Graphics } from "pixi.js";
import {
  fromPixiGlobals,
  PlusIconSize,
  StrokeWidth,
  White,
} from "../../context/Pixi-Globals-Store";

export const HorizontalLine = () => {
  const g = new Graphics(fromPixiGlobals[0].HorizontalLineGraphicContext());
  g.interactive = false;
  return g;
};

export const VerticalLine = () => {
  const g = new Graphics(fromPixiGlobals[0].VerticalLineGraphicContext());
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
      width: StrokeWidth / 2,
      color: White,
    });
  g.interactive = false;
  return g;
};
