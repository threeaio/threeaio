import { createContext, JSX, ParentComponent, useContext } from "solid-js";
import { StadiumStateNew } from "../types/types";
import { createStore } from "solid-js/store";

const w = 60;
const initialState: StadiumStateNew = {};

export const makeGridContextNew = (initialState: StadiumStateNew) => {
  const [stadiumState, setStadiumState] =
    createStore<StadiumStateNew>(initialState);

  const resetStadiumState = () => {
    setStadiumState({
      ...initialState,
    });
  };

  return [
    {
      stadiumState,
    },
    {},
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
