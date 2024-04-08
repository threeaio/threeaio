import { Pt } from "pts";
import { createEffect, runWithOwner } from "solid-js";
import { Griddler } from "./grid-controls/Griddler";
import { fromStadiumState } from "../context/Grid-Store";
import { fromPixiGlobals } from "../context/Pixi-Globals-Store";

export const CornerBottomGriddler = () => {
  const [{ stadiumState }, { setStadiumNumRows, updateRowLine, addRowLine }] =
    fromStadiumState;

  const [{ PG, getCurrentOwner }, {}] = fromPixiGlobals;

  let width: number = 0;
  let start: Pt;
  let end: Pt;
  let linesAt: number[];
  let updateWidthByState = (_num: number) => {};
  let updateRowLinesByState = (_num: number[]) => {};

  const setNumRowsUpdate = (newX: number) => {
    if (newX > 0) {
      setStadiumNumRows(newX);
    }
  };

  const setRowLinePositionByIndex = (newX: number, index: number) => {
    if (newX >= 0 && newX <= stadiumState.numRows) {
      updateRowLine(newX, index);
    }
  };

  const setAddLine = () => {
    addRowLine(stadiumState.numRows / 2);
  };

  runWithOwner(getCurrentOwner(), () => {
    createEffect(() => {
      updateWidthByState(stadiumState.numRows);
    });
  });

  runWithOwner(getCurrentOwner(), () => {
    createEffect(() => {
      updateRowLinesByState(stadiumState.rowLinesAt);
    });
  });

  const setup = () => {
    width = stadiumState.numRows + stadiumState.cutOut.y;
    start = new Pt(0, width);
    end = new Pt(stadiumState.numRows, width);
    linesAt = stadiumState.rowLinesAt;

    const { container, draw, updateWidth, updateLines } = Griddler({
      stage: PG.mainStage!,
      start,
      end,
      linesAt,
      dir: -1,
      handleAddElement: setAddLine,
      handleEndUpdate: setNumRowsUpdate,
      handleLineUpdate: setRowLinePositionByIndex,
    });

    updateWidthByState = updateWidth;
    updateRowLinesByState = updateLines;

    return {
      container,
      draw,
    };
  };

  return {
    setup,
  };
};
