import { Pt } from "pts";

export type Subset<K, T extends K> = T;

export const BEZIER_CIRCLE: 0.552284749831 = 0.552284749831;

export type CanvasControl = {
  el: HTMLDivElement | null;
  view: {
    width: number;
    height: number;
    x: number;
    y: number;
    zoom: number;
  };
  viewPos: {
    prevY: null | number;
    prevX: null | number;
    isDragging: boolean;
  };
};

export type ArbitLine = [Pt, Pt, number];

export interface StadiumState {
  arbitCorners: boolean;
  arbitCornerLines: ArbitLine[];
  longSide: Pt;
  shortSide: Pt;
  sharpen: Pt; // TODO wording
  innerCornerShape: Pt; // TODO wording
  bezierValue: number;
  angleAmount: number;
  rowAmount: number;
  colSize: number; // determines how many cols on straight so far
  t1AngleOffset: number;
  t2AngleOffset: number;
}

export type AreaPosition =
  | "topLeft"
  | "top"
  | "topRight"
  | "right"
  | "rightBottom"
  | "bottom"
  | "leftBottom"
  | "left";

export type SimpleLine = [Pt, Pt];

export type CenterLines = {
  centerVerticalAxis: SimpleLine;
  centerHorizontalAxis: SimpleLine;
};

// TODO Remove/Refactor !
export type CornerElement = {
  lineToTop: SimpleLine;
  lineRight: SimpleLine;
};

export type CornerElementRow = CornerElement[];

export type Corner = CornerElementRow[];

// export type foo
export type GridCell = {
  belongsTo: AreaPosition;
  xIndex?: number;
  yIndex?: number;
  bottomLeft: Pt; // position
  vectorToRight: Pt; //
  vectorToTop: Pt;
  vectorDiagonal: Pt; // temporarily
  topCell?: GridCell | null;
  bottomCell?: GridCell | null;
  rightCell?: GridCell;
  leftCell?: GridCell;
};

export type AreaDefinition = {
  type: "corner" | "straight";
  leftNeighbour: AreaPosition;
  rightNeighbour: AreaPosition;
  data: unknown[];
};

export type AreaDefinitionWithCells = AreaDefinition & {
  cells: GridCell[][];
};

export type AreaDict = {
  [key in AreaPosition]: AreaDefinition;
};

export type AreaDictWithCells = {
  [key in AreaPosition]: AreaDefinitionWithCells;
};

export type CellLines = {
  lineToTop: SimpleLine | null;
  lineRight: SimpleLine | null;
};

export interface Dict<T> {
  [ID: number]: T;
}
