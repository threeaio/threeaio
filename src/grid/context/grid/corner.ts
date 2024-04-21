import { StadiumStateNew } from "./Grid-Store";
import { Pt } from "pts";

export const getCornerDimensions = (state: StadiumStateNew): Pt => {
  const w = state.numRows + state.cutOut.x;
  const h = state.numRows + state.cutOut.y;
  return new Pt(w, h);
};

export const calculateCornerCells = (state: StadiumStateNew) => {
  const dimensions = getCornerDimensions(state);
  const segmments = [0, ...state.rowLinesAt]; // + state.numRows
  const xStartBottom = 0;
  const yStartBottom = dimensions.y;
  const xStartRight = dimensions.x;
  const yStartRight = 0;
  const cells = segmments.map((position, index) => {
    const isLast = index === segmments.length - 1;
    const nextPosition = isLast ? state.numRows : segmments[index + 1];

    // looking from match-field
    const bottomLeft = new Pt(xStartBottom + nextPosition, yStartBottom);
    const topLeft = new Pt(xStartBottom + position, yStartBottom);
    const topRight = new Pt(xStartRight, yStartRight + position);
    const bottomRight = new Pt(xStartRight, yStartRight + nextPosition);

    return [bottomLeft, topLeft, topRight, bottomRight];
  });
  return cells;
};
