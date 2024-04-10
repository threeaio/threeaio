import { createStore } from "solid-js/store";

export interface LandingPage {
  totalHeight: number; // number od max Rows
  totallyScrolled: number;
  currentSection: number;
  scrollSpeed: number;
  scrollDirection: 1 | -1;
}

const initialState: LandingPage = {
  totalHeight: 0,
  totallyScrolled: 0,
  currentSection: 0,
  scrollSpeed: 0,
  scrollDirection: 1,
};

const setupLandingPage = (initialState: LandingPage) => {
  const [landingPageState, setLandingPageState] =
    createStore<LandingPage>(initialState);

  const setTotalHeight = (height: number) => {
    setLandingPageState("totalHeight", height);
  };

  return [
    {
      landingPageState,
    },
    {
      setTotalHeight,
    },
  ] as const;
};

type LandingPageStateType = ReturnType<typeof setupLandingPage>;
export const fromLandingPageState: LandingPageStateType =
  setupLandingPage(initialState);
