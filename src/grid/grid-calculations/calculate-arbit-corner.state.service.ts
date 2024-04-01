import { Group, Line, Num, Pt } from "pts";
import { StadiumState } from "../types/types";
import { Accessor, createMemo } from "solid-js";
import { createArrayFromLength } from "../_util/generic.functions";

export const arbitCurves = (
  stadiumState: StadiumState,
  cornerDimensions: Accessor<Pt>,
): {
  curves: Accessor<Pt[][]>;
  hittingArbits: Accessor<Pt[][]>;
} => {
  // const lines = cornerLines();
  const fullCornerWidth = cornerDimensions().x;
  const fullCornerHeight = cornerDimensions().y;
  const innerRadiusX = stadiumState.innerCornerShape.x;
  const numRows = stadiumState.rowAmount;
  const rows = createArrayFromLength(numRows + 1);

  const way = new Pt(stadiumState.longSide.x, stadiumState.shortSide.y);

  const startX = new Pt(
    stadiumState.longSide.x,
    stadiumState.shortSide.y + stadiumState.innerCornerShape.y,
  );

  const startY = new Pt(
    stadiumState.longSide.x + stadiumState.innerCornerShape.x,
    stadiumState.shortSide.y,
  );

  // TODO limit in UI ?
  const sharpenWidth = Math.min(
    stadiumState.sharpen.x,
    stadiumState.longSide.x,
  );
  const sharpenHeight = Math.min(
    stadiumState.sharpen.y,
    stadiumState.shortSide.y,
  );

  const withoutArbit = rows.map((_row, rowIndex) => {
    const lerpValue = rowIndex / (rows.length - 1);

    const xDiff = Num.lerp(0, way.x, lerpValue);
    const yDiff = Num.lerp(0, way.y, lerpValue);

    const newX = stadiumState.longSide.x - xDiff;
    const newY = stadiumState.shortSide.y - yDiff;

    const offsetXBySharpness = Num.lerp(0, sharpenWidth, lerpValue);
    const offsetYBySharpness = Num.lerp(0, sharpenHeight, lerpValue);

    return [
      new Pt(newX, fullCornerHeight - offsetYBySharpness),
      new Pt(fullCornerWidth - offsetXBySharpness, newY),
    ];
  });

  const hittingArbits = stadiumState.arbitCornerLines.reduce((prev, curr) => {
    const currLine = new Group(curr[0], curr[1]);
    // todo make tests if in allowed areas
    // const firstRow = withoutArbit[0];
    // const lastRow = withoutArbit[withoutArbit.length - 1];
    // const crossStartPt = Line.intersectLine2D(firstRow, currLine);
    // const crossEndtPt = Line.intersectLine2D(lastRow, currLine);
    // console.log("crossStartPt", crossStartPt);
    // console.log("crossEndtPt", crossEndtPt);
    return [...prev, [currLine[0], new Pt(0, 0), new Pt(0, 0), currLine[1]]];
    return prev;
  }, [] as Pt[][]);

  // todo: sort arbits
  let withArbits;
  if (hittingArbits.length) {
    const arbitSubPoints = hittingArbits.map((arbit) => {
      return [
        arbit[0],
        ...Line.subpoints([arbit[0], arbit[3]], rows.length - 2),
        arbit[3],
      ];
    });

    withArbits = withoutArbit.map((row, rowIndex) => {
      const start = row[0];
      const end = row[1];

      return hittingArbits.reduce(
        (prev, curr, currentIndex) => {
          const divideInMiddle = hittingArbits.map((arbit) => {
            return Line.subpoints(
              [prev.at(-1)!, arbitSubPoints[currentIndex][rowIndex]],
              1,
            );
          });
          const middle = divideInMiddle[0][0];

          if (currentIndex === hittingArbits.length - 1) {
            const divideInMiddleLast = hittingArbits.map((arbit) => {
              return Line.subpoints(
                [arbitSubPoints[currentIndex][rowIndex], end],
                1,
              );
            });
            const middleLast = divideInMiddleLast[0][0];
            return [
              ...prev,
              middle,
              arbitSubPoints[currentIndex][rowIndex],
              middleLast,
              end,
            ];
          }
          return [...prev, middle, arbitSubPoints[currentIndex][rowIndex]];
        },
        [start],
      );
    });
  } else {
    withArbits = withoutArbit;
  }
  return {
    curves: createMemo(() => withArbits),
    hittingArbits: createMemo(() => hittingArbits),
  };
};
