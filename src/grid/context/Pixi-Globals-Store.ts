import { Application, Container } from "pixi.js";
import { Owner } from "solid-js";
import { createStore } from "solid-js/store";

export const StrokeWidth = 2;
export const White = 0xffffff;
export const Dark = 0x001122;
export const StrokeStyle = { width: StrokeWidth, color: White };
export const StrokeStyleSupport = { width: StrokeWidth / 2, color: White };

export const GriddlerDistance = 40; // should not scale
export const PlusIconSize = 21;
export const PlusIconDistance = 8;
export const DraggerRadius = 10;
export const LineDraggerDistance = 10;
export const EndDraggerDistance = LineDraggerDistance * 2;

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
