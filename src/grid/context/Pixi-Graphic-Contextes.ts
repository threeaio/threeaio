import { GraphicsContext } from "pixi.js";
import {
  Dark,
  DraggerRadius,
  StrokeStyle,
  StrokeWidth,
  White,
} from "./Pixi-Globals-Store";

export const PixiGraphicContextes: () => {
  setup: () => void;
  getter: {
    HorizontalLineGraphicContext: () => GraphicsContext;
    DragHandle: () => GraphicsContext;
    VerticalLineGraphicContext: () => GraphicsContext;
  };
} = () => {
  let _DragHandle: GraphicsContext;
  let _HorizontalLineGraphicContext: GraphicsContext;
  let _VerticalLineGraphicContext: GraphicsContext;

  const setup = () => {
    if (_DragHandle) {
      _DragHandle.destroy();
    }
    if (_HorizontalLineGraphicContext) {
      _HorizontalLineGraphicContext.destroy();
    }
    if (_VerticalLineGraphicContext) {
      _VerticalLineGraphicContext.destroy();
    }
    _DragHandle = new GraphicsContext()
      .circle(0, 0, DraggerRadius)
      .stroke(StrokeStyle)
      .fill(Dark);

    _HorizontalLineGraphicContext = new GraphicsContext()
      .moveTo(0, 0)
      .lineTo(StrokeWidth / 2, 0)
      .stroke({
        width: StrokeWidth / 2,
        color: White,
      });
    _VerticalLineGraphicContext = new GraphicsContext()
      .moveTo(0, 0)
      .lineTo(0, StrokeWidth / 2)
      .stroke({
        width: StrokeWidth / 2,
        color: White,
      });
  };

  const DragHandle = () => _DragHandle;
  const HorizontalLineGraphicContext = () => _HorizontalLineGraphicContext;
  const VerticalLineGraphicContext = () => _VerticalLineGraphicContext;

  return {
    setup,
    getter: {
      DragHandle,
      HorizontalLineGraphicContext,
      VerticalLineGraphicContext,
    },
  };
};
