import { GraphicsContext } from "pixi.js";
import { Dark, DraggerRadius, White } from "./Pixi-Globals-Store";

const PixiGraphicContextes: () => {
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
      .stroke({
        width: 2,
        color: White,
      })
      .fill(Dark);

    _HorizontalLineGraphicContext = new GraphicsContext()
      .moveTo(0, 0)
      .lineTo(1, 0)
      .stroke({
        width: 1,
        color: White,
      });
    _VerticalLineGraphicContext = new GraphicsContext()
      .moveTo(0, 0)
      .lineTo(0, 1)
      .stroke({
        width: 1,
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

const pixiGraphicContext = PixiGraphicContextes();

export const setupPixiGraphicContext = pixiGraphicContext.setup;
export const pixiGraphicContextGetter = pixiGraphicContext.getter;
