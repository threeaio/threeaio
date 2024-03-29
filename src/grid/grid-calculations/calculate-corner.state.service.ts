import { Curve, Group, Num, Pt } from "pts";
import {
  cloneGroup,
  makeGroups,
  mapCornerToDirectedLines,
} from "../_util/pts-utilities";
import { CellLines, CenterLines, StadiumState } from "../types/types";
import { Accessor } from "solid-js";
import { createArrayFromLength } from "../_util/generic.functions";

export const cornerLines = (stadiumState: Accessor<StadiumState>) => {
  const _stadiumState = stadiumState();
  const longSideline = new Group(
    new Pt(_stadiumState.longSide.x, _stadiumState.shortSide.y),
    new Pt(
      _stadiumState.longSide.x,
      _stadiumState.shortSide.y + _stadiumState.innerCornerShape.y,
    ),
  );
  const shortSideline = new Group(
    new Pt(_stadiumState.longSide.x, _stadiumState.shortSide.y),
    new Pt(
      _stadiumState.longSide.x + _stadiumState.innerCornerShape.x,
      _stadiumState.shortSide.y,
    ),
  );
  return {
    longSideline,
    shortSideline,
  };
};

export const curvesRaw: (
  stadiumState: Accessor<StadiumState>,
  cornerDimensions: Accessor<Pt>,
) => [Pt, Pt, Pt, Pt][] = (
  stadiumState: Accessor<StadiumState>,
  cornerDimensions: Accessor<Pt>,
) => {
  // const lines = cornerLines();
  const _stadiumState = stadiumState();
  const fullWidth = cornerDimensions().x;
  const fullHeight = cornerDimensions().y;

  // TODO limit in UI ?
  const sharpenWidth = Math.min(
    _stadiumState.sharpen.x,
    _stadiumState.longSide.x,
  );
  const sharpenHeight = Math.min(
    _stadiumState.sharpen.y,
    _stadiumState.shortSide.y,
  );

  const way = new Pt(_stadiumState.longSide.x, _stadiumState.shortSide.y);

  const rows = createArrayFromLength(_stadiumState.rowAmount + 1);

  const BEZIER_STRENGTH = _stadiumState.bezierValue;

  const startX = new Pt(
    _stadiumState.longSide.x,
    _stadiumState.shortSide.y + _stadiumState.innerCornerShape.y,
  );

  const startY = new Pt(
    _stadiumState.longSide.x + _stadiumState.innerCornerShape.x,
    _stadiumState.shortSide.y,
  );

  const rowsWithCols = rows.map((index) => {
    const lerpValue = index / (rows.length - 1);

    const xDiff = Num.lerp(0, way.x, lerpValue);
    const yDiff = Num.lerp(0, way.y, lerpValue);

    const newX = _stadiumState.longSide.x - xDiff;
    const newY = _stadiumState.shortSide.y - yDiff;

    const offsetXBySharpness = Num.lerp(0, sharpenWidth, lerpValue);
    const offsetYBySharpness = Num.lerp(0, sharpenHeight, lerpValue);

    const newXWithSharpness = newX + offsetXBySharpness;
    const newYWithSharpness = newY + offsetYBySharpness;

    const bezierPositionX =
      fullWidth - BEZIER_STRENGTH * (fullWidth - newXWithSharpness);
    const bezierPositionY =
      fullHeight - BEZIER_STRENGTH * (fullHeight - newYWithSharpness);

    const startControl = new Pt(newX, bezierPositionY).subtract(
      0,
      offsetYBySharpness,
    );
    const endControl = new Pt(bezierPositionX, newY).subtract(
      offsetXBySharpness,
      0,
    );

    const pt1 = startX.$subtract(xDiff, offsetYBySharpness);
    const pt2 = startY.$subtract(offsetXBySharpness, yDiff);

    return [pt1, startControl, endControl, pt2];
  });
  return rowsWithCols as [Pt, Pt, Pt, Pt][];
};

// manipulate by t
export const curves = (
  stadiumState: Accessor<StadiumState>,
  curvesRaw: Accessor<[Pt, Pt, Pt, Pt][]>,
) => {
  const steps = stadiumState().angleAmount;

  return curvesRaw().map((bezier) => {
    const _bezierHere = Curve.bezier(bezier, steps);
    return _bezierHere.map((pt, index) => {
      // TODO
      const tOffset =
        index === 1
          ? stadiumState().t1AngleOffset
          : index === 2
            ? stadiumState().t2AngleOffset
            : 0;
      if (index === _bezierHere.length - 1 || tOffset === 0) {
        return pt;
      }
      const tBefore = (index - 1) / steps || 0;
      const tCurrent = index / steps + tOffset / steps;
      const tAfter = (index + 1) / steps || 1;
      // TODO
      const tWithOffsetBefore =
        (index === 2
          ? tBefore + stadiumState().t1AngleOffset / steps
          : tBefore) || 0;
      // TODO
      const tWithOffsetAfter =
        (index === 1
          ? tAfter + stadiumState().t2AngleOffset / steps
          : tAfter) || 1;

      const sorted = [tWithOffsetBefore, tWithOffsetAfter].sort(
        (a, b) => a - b,
      );

      const clamped = Num.clamp(
        tCurrent,
        Math.max(sorted[0], 0),
        Math.min(sorted[1], 1),
      );

      // console.log('=======');
      // console.log('tAfter', tAfter);
      // console.log('unclamped', tCurrent);
      // console.log('tWithOffsetBefore', tWithOffsetBefore);
      // console.log('tWithOffsetAfter', tWithOffsetAfter);
      // console.log('clamped', clamped);

      const newT = clamped; //  Num.clamp(tCurrent + tOffset / steps, tWithOffsetBefore, tWithOffsetAfter);

      const newCoefficient = new Pt([newT * newT * newT, newT * newT, newT, 1]);
      return Curve.bezierStep(newCoefficient, bezier);
    });
  });
};

export const curveAreasLines = (
  centerLines: Accessor<CenterLines>,
  curves: Accessor<Pt[][]>,
): {
  bottomLeft: CellLines[][];
  bottomRight: CellLines[][];
  topLeft: CellLines[][];
  topRight: CellLines[][];
} => {
  const { centerVerticalAxis, centerHorizontalAxis } = centerLines();

  const curveTopLeft = makeGroups(curves());
  const curveTopRight = curveTopLeft
    .map(cloneGroup)
    .map((g) => g.reflect2D(centerVerticalAxis));
  const curveBottomLeft = curveTopLeft
    .map(cloneGroup)
    .map((g) => g.reflect2D(centerHorizontalAxis));
  const curveBottomRight = curveTopRight
    .map(cloneGroup)
    .map((g) => g.reflect2D(centerHorizontalAxis));

  const curveTopLeftPoints = mapCornerToDirectedLines(curveTopLeft);
  const curveTopRightPoints = mapCornerToDirectedLines(curveTopRight, true);
  const curveBottomRightPoints = mapCornerToDirectedLines(curveBottomRight);
  const curveBottomLeftPoints = mapCornerToDirectedLines(curveBottomLeft, true);

  return {
    topLeft: curveTopLeftPoints,
    topRight: curveTopRightPoints,
    bottomRight: curveBottomRightPoints,
    bottomLeft: curveBottomLeftPoints,
  };
};
