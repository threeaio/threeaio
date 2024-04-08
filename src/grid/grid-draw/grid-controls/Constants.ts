// move all these to Config
import { Graphics, GraphicsContext } from "pixi.js";

export const StrokeWidth = 2;
export const White = 0xffffff;
export const Dark = 0x001122;
export const StrokeStyle = { width: StrokeWidth, color: White };
export const StrokeStyleSupport = { width: StrokeWidth / 2, color: White };

export const GriddlerDistance = 40; // should not scale
export const PlusIconSize = 21;
export const PlusIconDistance = 8;
export const DraggerRadius = 10;
export const LineDraggerDistance = 10;
export const EndDraggerDistance = LineDraggerDistance * 2;

export const DragHandle = new GraphicsContext()
  .circle(0, 0, DraggerRadius)
  .stroke(StrokeStyle)
  .fill(Dark);

const HotizontalLineGraphicContext = new GraphicsContext()
  .moveTo(0, 0)
  .lineTo(StrokeWidth / 2, 0)
  .stroke({
    width: StrokeWidth / 2,
    color: White,
  });

const VerticalLineGraphicContext = new GraphicsContext()
  .moveTo(0, 0)
  .lineTo(0, StrokeWidth / 2)
  .stroke({
    width: StrokeWidth / 2,
    color: White,
  });

export const HorizontalLine = () => {
  const g = new Graphics(HotizontalLineGraphicContext);
  g.interactive = false;
  return g;
};

export const VerticalLine = () => {
  const g = new Graphics(VerticalLineGraphicContext);
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
