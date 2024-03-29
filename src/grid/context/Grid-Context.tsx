import {
  Accessor,
  createContext,
  createMemo,
  createSignal,
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
  SimpleLine,
  StadiumState,
} from "../types/types";
import { Pt } from "pts";
import {
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

const initialState: StadiumState = {
  longSide: new Pt(60, 120),
  shortSide: new Pt(60, 60),
  innerCornerShape: new Pt(10, 10),
  sharpen: new Pt(0, 0),
  bezierValue: BEZIER_CIRCLE,
  angleAmount: 3,
  rowAmount: 6,
  t1AngleOffset: 0,
  t2AngleOffset: 0,
};

export const makeGridContext = (initialState: StadiumState) => {
  const [stadiumState, setStadiumState] =
    createSignal<StadiumState>(initialState);

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

  const curveAreasLines: Accessor<{
    bottomLeft: CellLines[][];
    bottomRight: CellLines[][];
    topLeft: CellLines[][];
    topRight: CellLines[][];
  }> = createMemo(() => makeCurveAreasLines(centerLines, curves));

  const straightAreasLines: Accessor<{
    top: SimpleLine[];
    left: SimpleLine[];
    bottom: SimpleLine[];
    right: SimpleLine[];
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
