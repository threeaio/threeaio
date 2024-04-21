import { Graphics, GraphicsContext } from "pixi.js";
import { StrokeStyle } from "../../grid/context/Pixi-Globals-Store";

const StrokeWidth = 1;
const White = 0xffffff;

const PixiLandingPageGraphicContextes: () => {
  setup: () => void;
  getter: {
    VerticalLineGraphicContext: () => GraphicsContext;
  };
} = () => {
  let _VerticalLineGraphicContext: GraphicsContext;

  const setup = () => {
    if (_VerticalLineGraphicContext) {
      _VerticalLineGraphicContext.destroy();
    }

    _VerticalLineGraphicContext = new GraphicsContext()
      .moveTo(0, 0)
      .lineTo(1, 0)
      .stroke(StrokeStyle);
  };

  const VerticalLineGraphicContext = () => _VerticalLineGraphicContext;

  return {
    setup,
    getter: {
      VerticalLineGraphicContext,
    },
  };
};

const pixiGraphicContext = PixiLandingPageGraphicContextes();

export const setupGraphicContext = pixiGraphicContext.setup;
export const graphicContextGetter = pixiGraphicContext.getter;

export const VerticalLine = () => {
  const g = new Graphics(graphicContextGetter.VerticalLineGraphicContext());
  g.interactive = false;
  return g;
};
