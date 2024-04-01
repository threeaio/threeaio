import {
  Accessor,
  createContext,
  createMemo,
  JSX,
  ParentComponent,
  useContext,
} from "solid-js";
import {
  AreaDict,
  BEZIER_CIRCLE,
  CellLines,
  CenterLines,
  GridCell,
  StadiumState,
} from "../types/types";
import { Pt } from "pts";
import {
  makeArbitCurves,
  makeCenterLines,
  makeCornerDimensions,
  makeCurveAreasLines,
  makeCurves,
  makeCurvesRaw,
  makeStadiumDimensions,
  makeStadiumGrid,
  makeStadiumLines,
  makeStraightAreasLines,
} from "../grid-calculations";
import { createStore } from "solid-js/store";

const w = 60;
const initialState: StadiumState = {
  longSide: new Pt(w, 140),
  shortSide: new Pt(55, w),
  innerCornerShape: new Pt(30, 30),
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

  const curvesRaw: Accessor<[Pt, Pt, Pt, Pt][]> = createMemo(() =>
    makeCurvesRaw(stadiumState, cornerDimensions),
  );

  const curves: Accessor<Pt[][]> = createMemo(() =>
    makeCurves(stadiumState, curvesRaw),
  );

  const arbitCurves: Accessor<{
    curves: Accessor<Pt[][]>;
    hittingArbits: Accessor<Pt[][]>;
  }> = createMemo(() => makeArbitCurves(stadiumState, cornerDimensions));

  const curveAreasLines: Accessor<{
    bottomLeft: CellLines[][];
    bottomRight: CellLines[][];
    topLeft: CellLines[][];
    topRight: CellLines[][];
  }> = createMemo(() =>
    stadiumState.arbitCorners
      ? makeCurveAreasLines(centerLines, arbitCurves().curves)
      : makeCurveAreasLines(centerLines, curves),
  );

  const straightAreasLines: Accessor<{
    top: CellLines[][];
    left: CellLines[][];
    bottom: CellLines[][];
    right: CellLines[][];
  }> = createMemo(() =>
    makeStraightAreasLines(stadiumState, cornerDimensions, centerLines),
  );

  const stadiumLines: Accessor<AreaDict> = createMemo(() =>
    makeStadiumLines(curveAreasLines, straightAreasLines),
  );

  const stadiumGrid: Accessor<GridCell[]> = createMemo(() =>
    makeStadiumGrid(stadiumState, stadiumLines),
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
      stadiumGrid,
      arbitCurves: arbitCurves,
    },
    { setStadiumState, resetStadiumState },
  ] as const;
};

type GridContextType = ReturnType<typeof makeGridContext>;

export const GridContext = createContext<GridContextType>();

export const GridProvider: ParentComponent = (props: {
  children?: JSX.Element;
}) => {
  const state = makeGridContext(initialState);

  return (
    <GridContext.Provider value={state}>{props.children}</GridContext.Provider>
  );
};

export const useGrid = () => {
  const value = useContext(GridContext);
  if (value === undefined) {
    throw new Error("useGrid must be used within a GridContext.Provider");
  }
  return value;
};
