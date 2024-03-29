import { Line, Pt } from "pts";
import { GridCell, SimpleLine } from "../types/types";

const lineColor = "rgba(0, 255, 200,1)";
const strokeWidth = 0.5;

export const drawArrow = (ctx: CanvasRenderingContext2D, line: SimpleLine) => {
  const arrow = Line.marker([line[0], line[1]], new Pt(5, 5), "arrow");
  if (arrow && arrow.length === 3) {
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.moveTo(arrow[0].x, arrow[0].y);
    ctx.lineTo(arrow[1].x, arrow[1].y);
    ctx.lineTo(arrow[2].x, arrow[2].y);
    ctx.lineTo(arrow[0].x, arrow[0].y);
    ctx.closePath();
    ctx.fill();
  }
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  _ptFrom: Pt,
  _ptTo: Pt,
  shoudDrawArrow = false,
) => {
  const ptFrom = _ptFrom.$add(1, 1);
  const ptTo = _ptTo.$add(1, 1);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = strokeWidth;
  ctx.beginPath();
  ctx.setLineDash([4, 2]);
  ctx.moveTo(ptFrom.x, ptFrom.y);
  ctx.lineTo(ptTo.x, ptTo.y);
  ctx.stroke();
  if (shoudDrawArrow) {
    drawArrow(ctx, [ptFrom, ptTo]);
  }
};

export const drawDot = (ctx: CanvasRenderingContext2D, _ptHere: Pt) => {
  const ptHere = _ptHere.$add(1, 1);
  ctx.beginPath();
  ctx.fillStyle = "#FFF";
  ctx.arc(ptHere.x, ptHere.y, 2, 0, 2 * Math.PI);
  ctx.fill();
};

export const drawCell = (
  ctx: CanvasRenderingContext2D,
  gridCell: GridCell,
  scaleFactor: number,
  highlight = false,
  softHighlight = false,
) => {
  const pt1 = gridCell.bottomLeft.$multiply(scaleFactor);
  const pt1_raw = gridCell.bottomLeft;
  const pt2 = pt1_raw.$add(gridCell.vectorToRight).$multiply(scaleFactor);
  const pt3 = pt1_raw.$add(gridCell.vectorToTop).$multiply(scaleFactor);
  const pt4 = pt1_raw.$add(gridCell.vectorDiagonal).$multiply(scaleFactor);

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = strokeWidth;

  ctx.beginPath();
  ctx.moveTo(pt1.x, pt1.y);
  ctx.lineTo(pt2.x, pt2.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pt1.x, pt1.y);
  ctx.lineTo(pt3.x, pt3.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pt3.x, pt3.y);
  ctx.lineTo(pt4.x, pt4.y);
  ctx.stroke();

  if (highlight || softHighlight) {
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.lineTo(pt4.x, pt4.y);
    ctx.lineTo(pt3.x, pt3.y);
    ctx.fillStyle = highlight
      ? "rgba(255,255,255, .3)"
      : "rgba(255,255,255, .1)";
    ctx.fill();
  }

  // drawArrow(ctx, [pt1, pt2]);
  // drawArrow(ctx, [pt1, pt3]);
};
