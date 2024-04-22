import { Container, Graphics } from "pixi.js";
import { useGrid } from "../../../../../context/_old/_Grid-Context";

export const ArbitAreas = () => {
  const [
    { stadiumState, stadiumDimensions, cornerDimensions },
    { setStadiumState },
  ] = useGrid();

  const container = new Container();

  const strokeWidth = 0.4;

  let stage: Container;

  const createLines = () => {
    container.removeChildren();
    const outer = new Graphics();
    outer
      .moveTo(0, 0)
      .lineTo(cornerDimensions().x, 0)
      .moveTo(0, 0)
      .lineTo(0, cornerDimensions().y)
      .lineTo(cornerDimensions().x, 0)
      .stroke({ width: strokeWidth, color: 0xff0000 })
      .fill(0x001122);

    container.addChild(outer);

    const inner = new Graphics();

    inner
      .moveTo(stadiumState.longSide.x, stadiumState.shortSide.y)
      .lineTo(cornerDimensions().x, stadiumState.shortSide.y)
      .moveTo(stadiumState.longSide.x, stadiumState.shortSide.y)
      .lineTo(stadiumState.longSide.x, cornerDimensions().y)
      .lineTo(cornerDimensions().x, stadiumState.shortSide.y)
      .stroke({ width: strokeWidth, color: 0xff0000 })
      .fill(0x001122);

    container.addChild(inner);
  };

  const updateWorld = (_app: Container) => {
    stage = _app;
  };

  createLines();

  return {
    container,
    updateWorld,
    createLines,
  };
};
