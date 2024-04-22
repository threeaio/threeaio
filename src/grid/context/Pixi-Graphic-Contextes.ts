import { GraphicsContext } from "pixi.js";
import { Dark, DraggerRadius, Green, White } from "./Pixi-Globals-Store";

const PixiGraphicContextes: () => {
  setup: () => void;
  getter: {
    ReadonlyLineContext: () => GraphicsContext;
    HorizontalLineGraphicContext: () => GraphicsContext;
    DragHandle: () => GraphicsContext;
    VerticalLineGraphicContext: () => GraphicsContext;
  };
} = () => {
  let _DragHandle: GraphicsContext;
  let _HorizontalLineGraphicContext: GraphicsContext;
  let _VerticalLineGraphicContext: GraphicsContext;
  let _ReadonlyLineContext: GraphicsContext;

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
    if (_ReadonlyLineContext) {
      _ReadonlyLineContext.destroy();
    }
    _DragHandle = new GraphicsContext()
      .circle(0, 0, DraggerRadius)
      .stroke({
        width: 2.5,
        color: White,
      })
      .fill(Dark);

    _HorizontalLineGraphicContext = new GraphicsContext()
      .moveTo(0, 0)
      .lineTo(1, 0)
      .stroke({
        width: 1.5,
        color: White,
      });
    _VerticalLineGraphicContext = new GraphicsContext()
      .moveTo(0, 0)
      .lineTo(0, 1)
      .stroke({
        width: 1.5,
        color: White,
      });
    _ReadonlyLineContext = new GraphicsContext()
      .moveTo(0, 0)
      .lineTo(1, 0)
      .stroke({
        width: 1.5,
        color: Green,
      });
  };

  const DragHandle = () => _DragHandle;
  const HorizontalLineGraphicContext = () => _HorizontalLineGraphicContext;
  const VerticalLineGraphicContext = () => _VerticalLineGraphicContext;
  const ReadonlyLineContext = () => _ReadonlyLineContext;

  return {
    setup,
    getter: {
      DragHandle,
      HorizontalLineGraphicContext,
      VerticalLineGraphicContext,
      ReadonlyLineContext,
    },
  };
};

const pixiGraphicContext = PixiGraphicContextes();

export const setupPixiGraphicContext = pixiGraphicContext.setup;
export const pixiGraphicContextGetter = pixiGraphicContext.getter;
