import { createStore } from "solid-js/store";

export interface LandingPage {
  totalContentHeight: number;
  totalWidth: number;
  screenHeight: number;
  totallyScrolled: number;
  currentSection: number;
  scrollSpeed: number;
  scrollDirection: 1 | -1;
}

const initialState: LandingPage = {
  totalContentHeight: 0,
  screenHeight: 0,
  totalWidth: 0,
  totallyScrolled: 0,
  currentSection: 0,
  scrollSpeed: 0,
  scrollDirection: 1,
};

const setupLandingPage = (initialState: LandingPage) => {
  const [landingPageState, setLandingPageState] =
    createStore<LandingPage>(initialState);

  const setTotalContentHeight = (height: number) => {
    setLandingPageState("totalContentHeight", height);
  };

  const setScreenHeight = (height: number) => {
    setLandingPageState("screenHeight", height);
  };

  const setTotalWidth = (width: number) => {
    setLandingPageState("totalWidth", width);
  };

  const setYScroll = (scollPos: number) => {
    setLandingPageState("totallyScrolled", scollPos);
  };

  const setScrollSpeed = (scollSpeed: number) => {
    setLandingPageState("scrollSpeed", scollSpeed);
  };

  // const percentScrolled = () => {
  //   return
  // }

  return [
    {
      landingPageState,
    },
    {
      setTotalContentHeight,
      setTotalWidth,
      setScreenHeight,
      setYScroll,
      setScrollSpeed,
    },
  ] as const;
};

type LandingPageStateType = ReturnType<typeof setupLandingPage>;
export const fromLandingPageState: LandingPageStateType =
  setupLandingPage(initialState);
