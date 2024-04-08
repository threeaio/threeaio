import { Container } from "pixi.js";
import { Owner } from "solid-js";
import { createStore } from "solid-js/store";

export interface PixiGlobalStore {
  mainStage: Container | null;
}

const initialState: PixiGlobalStore = {
  mainStage: null,
};

const setupPixiGlobalsStore = (initialState: PixiGlobalStore) => {
  let solidContextOwner: Owner | null = null;

  const [PG, setPixiGlobals] = createStore<PixiGlobalStore>(initialState);

  const setMainStage = (stage: Container) => {
    if (PG.mainStage !== null) {
      throw new Error("Pixi Stage already set!");
    }
    setPixiGlobals("mainStage", stage);
  };

  const setSolidContextOwner = (owner: Owner | null) => {
    if (solidContextOwner !== null) {
      throw new Error("Solid Context Owner Stage already set!");
    }
    solidContextOwner = owner;
  };

  const getCurrentOwner = () => {
    return solidContextOwner;
  };

  return [
    {
      PG,
      getCurrentOwner,
    },
    {
      setMainStage,
      setSolidContextOwner,
    },
  ] as const;
};

type GlobalsStateType = ReturnType<typeof setupPixiGlobalsStore>;
export const fromPixiGlobals: GlobalsStateType =
  setupPixiGlobalsStore(initialState);
