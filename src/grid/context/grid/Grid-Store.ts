import { createStore } from "solid-js/store";
import { Pt } from "pts";
import { calculateCornerCells } from "./corner";

export interface StadiumStateNew {
  numRows: number; // number od max Rows
  cutOut: Pt;
  rowLinesAt: number[];
}

const w = 60;
const initialState: StadiumStateNew = {
  numRows: 50,
  cutOut: new Pt(10, 10),
  rowLinesAt: [2, 4, 6, 8, 10, 12, 14, 16, 22, 26, 30, 34, 38],
};

const setupGridStore = (initialState: StadiumStateNew) => {
  const [stadiumState, setStadiumState] =
    createStore<StadiumStateNew>(initialState);

  const resetStadiumState = () => {
    setStadiumState({
      ...initialState,
    });
  };

  const setStadiumNumRows = (numRows: number) => {
    // ... process
    // ... clamp RowLines
    setStadiumState(
      "rowLinesAt",
      stadiumState.rowLinesAt.map((l) => (l > numRows ? numRows : l)),
    );
    setStadiumState("numRows", numRows);
  };

  const updateRowLine = (newX: number, index: number) => {
    // ... process
    setStadiumState("rowLinesAt", index, newX);
  };

  const addRowLine = (newX: number) => {
    // ... process ?
    setStadiumState(
      "rowLinesAt",
      [...stadiumState.rowLinesAt, newX].sort((a, b) => a - b),
    );
  };

  const setStadiumCutOutX = (newValue: number) => {
    const newPt = stadiumState.cutOut.clone();
    newPt.x = newValue;
    // ... process
    setStadiumState("cutOut", newPt);
  };

  const setStadiumCutOutY = (newValue: number) => {
    const newPt = stadiumState.cutOut.clone();
    newPt.y = newValue;
    // ... process
    setStadiumState("cutOut", newPt);
  };

  const getCornerCells = () => {
    return calculateCornerCells(stadiumState);
  };

  return [
    {
      stadiumState,
      getCornerCells,
    },
    {
      setStadiumNumRows,
      setStadiumCutOutX,
      setStadiumCutOutY,
      updateRowLine,
      addRowLine,
    },
  ] as const;
};

type StadiumStateType = ReturnType<typeof setupGridStore>;
export const fromStadiumState: StadiumStateType = setupGridStore(initialState);
