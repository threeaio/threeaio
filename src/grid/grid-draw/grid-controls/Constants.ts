// move all these to Config
import { Graphics } from "pixi.js";

export const StrokeWidth = 2;
export const White = 0xffffff;
export const Dark = 0x001122;
export const StrokeStyle = { width: StrokeWidth, color: White };
export const StrokeStyleSupport = { width: StrokeWidth / 2, color: White };

export const GriddlerDistance = 40; // should not scale
export const PlusIconSize = 20;
export const PlusIconDistance = 8;
export const DraggerRadius = 10;
export const LineDraggerDistance = 10;
export const EndDraggerDistance = LineDraggerDistance * 2;

export const HorizontalLine = () => {
  return new Graphics({ interactive: false })
    .moveTo(0, 0)
    .lineTo(StrokeWidth / 2, 0)
    .stroke({
      width: StrokeWidth / 2,
      color: White,
    });
};

export const VerticalLine = () => {
  return new Graphics({ interactive: false })
    .moveTo(0, 0)
    .lineTo(0, StrokeWidth / 2)
    .stroke({
      width: StrokeWidth / 2,
      color: White,
    });
};

export const PlusIcon = () => {
  const size = PlusIconSize;
  return new Graphics({ interactive: false })
    .moveTo(0, size / 2)
    .lineTo(size, size / 2)
    .moveTo(size / 2, 0)
    .lineTo(size / 2, size)
    .stroke({
      width: StrokeWidth,
      color: White,
    });
};
