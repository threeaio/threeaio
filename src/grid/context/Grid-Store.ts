import { StadiumStateNew } from "../types/types";
import { createStore } from "solid-js/store";
import { Pt } from "pts";
import { Container } from "pixi.js";

const w = 60;
const initialState: StadiumStateNew = {
  mainStage: null,
  numRows: 50,
  cutOut: new Pt(15, 15),
  rowLinesAt: [25],
};

const makeStadiumContextNew = (initialState: StadiumStateNew) => {
  const [stadiumState, setStadiumState] =
    createStore<StadiumStateNew>(initialState);

  const resetStadiumState = () => {
    setStadiumState({
      ...initialState,
    });
  };

  const setMainStage = (stage: Container) => {
    setStadiumState("mainStage", stage);
  };

  const setStadiumNumRows = (numRows: number) => {
    // ... process
    // ... clamp RowLines
    setStadiumState("numRows", numRows);
  };

  const updateRowLine = (newX: number, index: number) => {
    // ... process
    setStadiumState("rowLinesAt", index, newX);
  };

  const addRowLine = (newX: number) => {
    // ... process ?
    setStadiumState("rowLinesAt", [...stadiumState.rowLinesAt, newX]);
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

  return [
    {
      stadiumState,
    },
    {
      setMainStage,
      setStadiumNumRows,
      setStadiumCutOutX,
      setStadiumCutOutY,
      updateRowLine,
      addRowLine,
    },
  ] as const;
};

type StadiumStateType = ReturnType<typeof makeStadiumContextNew>;
export const fromStadiumState: StadiumStateType =
  makeStadiumContextNew(initialState);
