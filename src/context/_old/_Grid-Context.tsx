import {
  Accessor,
  createContext,
  createMemo,
  JSX,
  ParentComponent,
  useContext,
} from "solid-js";
import { Pt } from "pts";
import {
  makeArbitCurves,
  makeCenterLines,
  makeCornerDimensions,
  makeStadiumDimensions,
} from "./grid-calculations/_old";
import { createStore } from "solid-js/store";

import {
  pickLeft,
  pickRight,
  pickSameX,
} from "./grid-calculations/_old/calculate-full-grid.service";
import { BEZIER_CIRCLE, CenterLines, GridCell, StadiumState } from "@3a/types";
import { makeGroups, mapCornerToDirectedLines } from "@3a/utils";

const w = 60;
const initialState: StadiumState = {
  longSide: new Pt(w, 140),
  shortSide: new Pt(55, w),
  innerCornerShape: new Pt(15, 30),
  sharpen: new Pt(0, 0),
  bezierValue: BEZIER_CIRCLE,
  angleAmount: 1,
  rowAmount: 16,
  colSize: 60,
  t1AngleOffset: 0,
  t2AngleOffset: 0,
  arbitCorners: true,
  arbitCornerLines: [
    [new Pt(w, 70), new Pt(0, 36)],
    [new Pt(68, 65), new Pt(45, 5)],
  ],
  arbitAdditionalSplit: [
    { atIndex: 0, offset: 5 },
    { atIndex: 1, offset: 8 },
  ],
};

export const makeGridContext = (initialState: StadiumState) => {
  const [stadiumState, setStadiumState] =
    createStore<StadiumState>(initialState);

  const stadiumDimensions: Accessor<Pt> = createMemo(() =>
    makeStadiumDimensions(stadiumState),
  );

  const centerLines: Accessor<CenterLines> = createMemo(() =>
    makeCenterLines(stadiumDimensions),
  );

  const cornerDimensions: Accessor<Pt> = createMemo(() =>
    makeCornerDimensions(stadiumState),
  );

  const arbitCurves: Accessor<{
    curves: Accessor<Pt[][]>;
    hittingArbits: Accessor<Pt[][]>;
  }> = createMemo(() => makeArbitCurves(stadiumState, cornerDimensions));

  const stadium = createMemo(() =>
    mapCornerToDirectedLines(makeGroups(arbitCurves().curves()))
      .map((row): GridCell[] => {
        return row
          .filter((el) => !!el.lineRight && !!el.lineToTop)
          .map((el, colIndexLocal): GridCell => {
            const lineRight = el.lineRight!;
            const lineToTop = el.lineToTop!;
            return {
              belongsTo: "topLeft",
              bottomLeft: lineRight[0].clone(),
              vectorToRight: lineRight[1].$subtract(lineRight[0]),
              vectorToTop: lineToTop[1].$subtract(lineRight[0]),
              vectorDiagonal: row[colIndexLocal + 1]?.lineToTop![1].$subtract(
                lineToTop[0] || null,
              ),
            };
          });
      })
      .map((row, rowIndex): GridCell[] => {
        return row.map((cell, index) => {
          return {
            ...cell,
            xIndex: index,
            yIndex: rowIndex,
          };
        });
      })
      .map((row, rowIndex, allRows) => {
        const allRowsFlat = allRows.flatMap((e) => e);
        return row.map((cell) => {
          return {
            ...cell,
            leftCell: pickLeft(cell, row),
            rightCell: pickRight(cell, row),
            topCell:
              rowIndex < allRows.length - 1
                ? pickSameX(cell, allRows[rowIndex + 1])
                : null,
            bottomCell:
              rowIndex > 0 ? pickSameX(cell, allRows[rowIndex - 1]) : null,
          };
        });
      })
      .flatMap((e) => e),
  );

  const resetStadiumState = () => {
    setStadiumState({
      ...initialState,
    });
  };

  return [
    {
      stadiumState,
      stadiumDimensions,
      cornerDimensions,
      stadiumGrid: stadium,
      arbitCurves: arbitCurves,
    },
    { setStadiumState, resetStadiumState },
  ] as const;
};

type GridContextType = ReturnType<typeof makeGridContext>;

export const _GridContext = createContext<GridContextType>();

export const GridProvider: ParentComponent = (props: {
  children?: JSX.Element;
}) => {
  const state = makeGridContext(initialState);

  return (
    <_GridContext.Provider value={state}>
      {props.children}
    </_GridContext.Provider>
  );
};

export const useGrid = () => {
  const value = useContext(_GridContext);
  if (value === undefined) {
    throw new Error("useGrid must be used within a GridContext.Provider");
  }
  return value;
};
