import { Accessor } from "solid-js";
import { AreaDict, CellLines, CenterLines, StadiumState } from "../types/types";
import { Pt } from "pts";
import {
  curveAreasLines,
  curves,
  curvesRaw,
} from "./calculate-corner.state.service";
import { stadiumGrid, stadiumLines } from "./calculate-full-grid.service";
import { straightAreasLines } from "./calculate-straight.state.service";
import {
  centerLines,
  cornerDimensions,
  stadiumDimensions,
} from "./stadium.state.service";
import { arbitCurves } from "./calculate-arbit-corner.state.service";

export const makeStadiumDimensions = (state: StadiumState) =>
  stadiumDimensions(state);

export const makeCenterLines = (state: Accessor<Pt>) => centerLines(state);

export const makeCornerDimensions = (state: StadiumState) =>
  cornerDimensions(state);

export const makeCurvesRaw = (
  stadiumState: StadiumState,
  cornerDimensions: Accessor<Pt>,
) => curvesRaw(stadiumState, cornerDimensions);

export const makeCurves = (
  stadiumState: StadiumState,
  curvesRaw: Accessor<[Pt, Pt, Pt, Pt][]>,
) => curves(stadiumState, curvesRaw);

export const makeArbitCurves = (
  stadiumState: StadiumState,
  cornerDimensions: Accessor<Pt>,
) => arbitCurves(stadiumState, cornerDimensions);

export const makeCurveAreasLines = (
  centerLines: Accessor<CenterLines>,
  curves: Accessor<Pt[][]>,
) => curveAreasLines(centerLines, curves);

export const makeStraightAreasLines = (
  stadiumState: StadiumState,
  cornerDimensions: Accessor<Pt>,
  centerLines: Accessor<CenterLines>,
) => straightAreasLines(stadiumState, cornerDimensions, centerLines);

export const makeStadiumLines = (
  curveAreasLines: Accessor<{
    bottomLeft: CellLines[][];
    bottomRight: CellLines[][];
    topLeft: CellLines[][];
    topRight: CellLines[][];
  }>,
  straightAreasLines: Accessor<{
    top: CellLines[][];
    left: CellLines[][];
    bottom: CellLines[][];
    right: CellLines[][];
  }>,
) => stadiumLines(curveAreasLines, straightAreasLines);

export const makeStadiumGrid = (
  state: StadiumState,
  areas: Accessor<AreaDict>,
) => stadiumGrid(state, areas);
