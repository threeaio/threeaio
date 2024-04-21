import { Pt } from "pts";
import { SimpleLine, StadiumState } from "../types/types";
import { Accessor } from "solid-js";
import { getObjectKeys } from "../../_util/generic.functions";

export const stadiumDimensions = (stadiumState: StadiumState): Pt => {
  return new Pt(
    stadiumState.longSide.x * 2 +
      stadiumState.innerCornerShape.x * 2 +
      stadiumState.shortSide.x,
    stadiumState.shortSide.y * 2 +
      stadiumState.innerCornerShape.y * 2 +
      stadiumState.longSide.y,
  );
};

export const centerLines: (stadiumDimensions: Accessor<Pt>) => {
  centerVerticalAxis: SimpleLine;
  centerHorizontalAxis: SimpleLine;
} = (stadiumDimensions: Accessor<Pt>) => {
  const centerVerticalAxis: SimpleLine = [
    new Pt(stadiumDimensions().x / 2, 0),
    new Pt(stadiumDimensions().x / 2, stadiumDimensions().y),
  ];

  const centerHorizontalAxis: SimpleLine = [
    new Pt(0, stadiumDimensions().y / 2),
    new Pt(stadiumDimensions().x, stadiumDimensions().y / 2),
  ];
  return {
    centerVerticalAxis,
    centerHorizontalAxis,
  };
};

export const cornerDimensions = (stadiumState: StadiumState) => {
  const _cornerState = stadiumState;
  return new Pt(
    _cornerState.longSide.x + _cornerState.innerCornerShape.x,
    _cornerState.shortSide.y + _cornerState.innerCornerShape.y,
  );
};

export const isSameSetting = (a: StadiumState, b: StadiumState): boolean => {
  return !a ? false : getObjectKeys(b).every((key) => a[key] === b[key]);
};
