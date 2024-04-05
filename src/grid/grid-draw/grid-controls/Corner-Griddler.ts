import { useGridNew } from "../../context/Grid-Context-New";
import { Pt } from "pts";
import { createEffect } from "solid-js";
import { Griddler } from "./Griddler";

export const CornerBottomGriddler = () => {
  const [
    { stadiumState, rowLinesAt },
    { setStadiumNumRows, updateRowLine, addRowLine },
  ] = useGridNew();

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
    addRowLine(Math.floor(stadiumState.numRows / 2));
  };

  createEffect(() => {
    updateWidthByState(stadiumState.numRows);
  });

  createEffect(() => {
    updateRowLinesByState(stadiumState.rowLinesAt);
    return [...(stadiumState.rowLinesAt || [])];
  }, []);

  const setup = () => {
    width = stadiumState.numRows + stadiumState.cutOut.y;
    start = new Pt(0, width);
    end = new Pt(stadiumState.numRows, width);
    linesAt = stadiumState.rowLinesAt;

    const { container, draw, updateWidth, updateLines } = Griddler({
      stage: stadiumState.mainStage!,
      start,
      end,
      linesAt,
      dir: -1,
      handleAddElement: setAddLine,
      handleEndUpdate: setNumRowsUpdate,
      handleLineUpdate: setRowLinePositionByIndex,
    });

    console.log("updateLines from griddler", updateLines);

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
