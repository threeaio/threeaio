import { Pt } from "pts";
import { CenterLines, SimpleLine, StadiumState } from "../types/types";
import { createArrayFromLength } from "../_util/generic.functions";
import {
  cloneGroup,
  groupAsSimpleLine,
  reversePointsInGroup,
  simpleLineAsGroup,
} from "../_util/pts-utilities";
import { Accessor } from "solid-js";

export const straightAreasLines = (
  stadiumState: Accessor<StadiumState>,
  cornerDimensions: Accessor<Pt>,
  centerLines: Accessor<CenterLines>,
) => {
  const longSide = stadiumState().longSide;
  const shortSide = stadiumState().shortSide;

  const numRows = stadiumState().rowAmount;

  const longSideRowWidth = longSide.x / numRows;
  const shortSideRowWidth = shortSide.y / numRows;

  const extendShort = Math.min(stadiumState().sharpen.x, longSide.x);
  const extendLong = Math.min(stadiumState().sharpen.y, shortSide.y);

  const longSideRowLengthModifier = extendLong / numRows;
  const shortSideRowLengthModifier = extendShort / numRows;

  const top: SimpleLine[] = createArrayFromLength(numRows + 1).map(
    (rowIndex) => {
      return [
        new Pt(
          cornerDimensions().x -
            extendShort +
            shortSideRowLengthModifier * rowIndex,
          shortSideRowWidth * rowIndex,
        ),
        new Pt(
          cornerDimensions().x +
            shortSide.x +
            extendShort -
            shortSideRowLengthModifier * rowIndex,
          shortSideRowWidth * rowIndex,
        ),
      ] as SimpleLine;
    },
  );

  const left: SimpleLine[] = createArrayFromLength(numRows + 1)
    .map((rowIndex) => {
      return [
        new Pt(
          longSideRowWidth * rowIndex,
          cornerDimensions().y +
            longSideRowLengthModifier * rowIndex -
            extendLong,
        ),
        new Pt(
          longSideRowWidth * rowIndex,
          cornerDimensions().y +
            longSide.y -
            longSideRowLengthModifier * rowIndex +
            extendLong,
        ),
      ] as SimpleLine;
    })
    .map(simpleLineAsGroup)
    .map(reversePointsInGroup)
    .map(groupAsSimpleLine);

  const { centerVerticalAxis, centerHorizontalAxis } = centerLines();

  const right: SimpleLine[] = left
    .map(simpleLineAsGroup)
    .map(cloneGroup)
    .map((g) => g.reflect2D(centerVerticalAxis))
    .map(reversePointsInGroup)
    .map(groupAsSimpleLine);

  const bottom: SimpleLine[] = top
    .map(simpleLineAsGroup)
    .map(cloneGroup)
    .map((g) => g.reflect2D(centerHorizontalAxis))
    .map(reversePointsInGroup)
    .map(groupAsSimpleLine);

  return {
    top,
    right,
    bottom,
    left,
  };
};
