import { createContext, JSX, ParentComponent, useContext } from "solid-js";
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

export const makeGridContextNew = (initialState: StadiumStateNew) => {
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
    setStadiumState("rowLinesAt", stadiumState.rowLinesAt.length, newX);
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

////////

type GridContextNewType = ReturnType<typeof makeGridContextNew>;

export const GridContextNew = createContext<GridContextNewType>();

export const GridProviderNew: ParentComponent = (props: {
  children?: JSX.Element;
}) => {
  const state = makeGridContextNew(initialState);

  return (
    <GridContextNew.Provider value={state}>
      {props.children}
    </GridContextNew.Provider>
  );
};

export const useGridNew = () => {
  const value = useContext(GridContextNew);
  if (value === undefined) {
    throw new Error("useGridNew must be used within a GridContextNew.Provider");
  }
  return value;
};
