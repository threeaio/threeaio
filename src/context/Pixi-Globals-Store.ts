import { Application, Container } from "pixi.js";
import { Owner } from "solid-js";
import { createStore } from "solid-js/store";

export interface PixiGlobalStore {
  mainStage: Container | null;
  pixiApp: Application | null;
}

const initialState: PixiGlobalStore = {
  mainStage: null,
  pixiApp: null,
};

const setupPixiGlobalsStore = (initialState: PixiGlobalStore) => {
  let solidContextOwner: Owner | null = null;

  const [PG, setPixiGlobals] = createStore<PixiGlobalStore>(initialState);

  const reset = () => {
    if (PG.pixiApp) {
      console.log("destroying");
      PG.pixiApp.destroy(true);
    }

    setPixiGlobals("pixiApp", null);
    setPixiGlobals("mainStage", null);
    solidContextOwner = null;

    console.log("PG.pixiApp after destroy", PG.pixiApp);
  };

  const setMainStage = (stage: Container) => {
    if (PG.mainStage !== null) {
      console.error("Pixi Stage already set!");
    }
    setPixiGlobals("mainStage", stage);
  };

  const setPixiApp = (app: Application) => {
    if (PG.pixiApp !== null) {
      console.error("Pixi App already set!");
      reset();
    }
    console.log("Pixi App set up!");
    setPixiGlobals("pixiApp", app);
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
      reset,
      setMainStage,
      setSolidContextOwner,
      setPixiApp,
    },
  ] as const;
};

type GlobalsStateType = ReturnType<typeof setupPixiGlobalsStore>;
export const fromPixiGlobals: GlobalsStateType =
  setupPixiGlobalsStore(initialState);
