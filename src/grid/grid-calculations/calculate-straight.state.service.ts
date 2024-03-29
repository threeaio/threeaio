import { Pt } from "pts";
import { CellLines, CenterLines, StadiumState } from "../types/types";
import { createArrayFromLength } from "../_util/generic.functions";
import {
  cloneGroup,
  makeGroups,
  mapCornerToDirectedLines,
} from "../_util/pts-utilities";
import { Accessor } from "solid-js";

export const straightAreasLines = (
  stadiumState: Accessor<StadiumState>,
  cornerDimensions: Accessor<Pt>,
  centerLines: Accessor<CenterLines>,
) => {
  const colSize = stadiumState().colSize;

  const longSide = stadiumState().longSide;
  const shortSide = stadiumState().shortSide;

  const numRows = stadiumState().rowAmount;

  const numColsLong = Math.ceil(Math.round(longSide.y) / colSize);
  const numColsShort = Math.ceil(Math.round(shortSide.x) / colSize);

  const longSideColWidth = longSide.y / numColsLong;
  const shortSideColWidth = shortSide.x / numColsShort;
  const longSideRowWidth = longSide.x / numRows;
  const shortSideRowWidth = shortSide.y / numRows;

  const extendShort = Math.min(stadiumState().sharpen.x, longSide.x);
  const extendLong = Math.min(stadiumState().sharpen.y, shortSide.y);

  const longSideRowLengthModifier = extendLong / numRows;
  const shortSideRowLengthModifier = extendShort / numRows;

  // const top: SimpleLine[] = createArrayFromLength(numRows + 1).map(
  //   (rowIndex) => {
  //     return [
  //       new Pt(
  //         cornerDimensions().x -
  //           extendShort +
  //           shortSideRowLengthModifier * rowIndex,
  //         shortSideRowWidth * rowIndex,
  //       ),
  //       new Pt(
  //         cornerDimensions().x +
  //           shortSide.x +
  //           extendShort -
  //           shortSideRowLengthModifier * rowIndex,
  //         shortSideRowWidth * rowIndex,
  //       ),
  //     ] as SimpleLine;
  //   },
  // );

  const topPts: Pt[][] = createArrayFromLength(numRows + 1).reduce(
    (prev, _curr, rowIndex) => {
      const cols = createArrayFromLength(numColsShort + 3).map(
        (_c, colIndex) => {
          const movedCol = shortSideColWidth * Math.max(colIndex - 1, 0);
          if (colIndex === 0) {
            return new Pt(
              cornerDimensions().x -
                extendShort +
                shortSideRowLengthModifier * rowIndex +
                movedCol,
              shortSideRowWidth * rowIndex,
            );
          } else if (colIndex === numColsShort + 2) {
            const movedColHere = shortSideColWidth * Math.max(colIndex - 2, 0);
            return new Pt(
              cornerDimensions().x +
                extendShort -
                shortSideRowLengthModifier * rowIndex +
                movedColHere,
              shortSideRowWidth * rowIndex,
            );
          } else {
            return new Pt(
              cornerDimensions().x + movedCol,
              shortSideRowWidth * rowIndex,
            );
          }
        },
      );

      return [...prev, cols];
    },
    [] as Pt[][],
  );

  const leftPts: Pt[][] = createArrayFromLength(numRows + 1).reduce(
    (prev, _curr, rowIndex) => {
      const cols = createArrayFromLength(numColsLong + 3).map(
        (_c, colIndex) => {
          const movedCol = longSideColWidth * Math.max(colIndex - 1, 0);

          if (colIndex === 0) {
            return new Pt(
              cornerDimensions().x -
                stadiumState().innerCornerShape.x -
                longSideRowWidth * rowIndex,
              longSide.y +
                cornerDimensions().y +
                longSideRowLengthModifier * rowIndex,
            );
          } else if (colIndex === numColsLong + 2) {
            const movedColHere = longSideColWidth * Math.max(colIndex - 2, 0);
            return new Pt(
              cornerDimensions().x -
                stadiumState().innerCornerShape.x -
                longSideRowWidth * rowIndex,
              cornerDimensions().y - longSideRowLengthModifier * rowIndex,
            );
          } else {
            return new Pt(
              cornerDimensions().x -
                stadiumState().innerCornerShape.x -
                longSideRowWidth * rowIndex,
              longSide.y + cornerDimensions().y - movedCol,
            );
          }
        },
      );

      return [...prev, cols];
    },
    [] as Pt[][],
  );

  const top = mapCornerToDirectedLines(makeGroups(topPts));
  const left = mapCornerToDirectedLines(makeGroups(leftPts));

  const { centerVerticalAxis, centerHorizontalAxis } = centerLines();

  // const right: SimpleLine[] = left
  //   .map(simpleLineAsGroup)
  //   .map(cloneGroup)
  //   .map((g) => g.reflect2D(centerVerticalAxis))
  //   .map(reversePointsInGroup)
  //   .map(groupAsSimpleLine);

  const bottom: CellLines[][] = mapCornerToDirectedLines(
    makeGroups(topPts)
      .map(cloneGroup)
      .map((g) => g.reflect2D(centerHorizontalAxis)),
    true,
  );

  const right: CellLines[][] = mapCornerToDirectedLines(
    makeGroups(leftPts)
      .map(cloneGroup)
      .map((g) => g.reflect2D(centerVerticalAxis)),
    true,
  );

  return {
    top,
    bottom,
    right,
    left,
  };
};
