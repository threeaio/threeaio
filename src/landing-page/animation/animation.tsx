import { Component, getOwner, onCleanup } from "solid-js";
import { Application } from "pixi.js";
import { fromLandingPageState } from "../landing-page-state";
import { fromPixiGlobals } from "../../grid/context/Pixi-Globals-Store";
import { Arrow } from "./Arrow";
import { setupGraphicContext } from "./Animation-Graphics-Contextes";
import { Num } from "pts";

export const DrawAnimation: Component = () => {
  const [{}, {}] = fromLandingPageState;
  const [{}, { setMainStage, setSolidContextOwner, setPixiApp, reset }] =
    fromPixiGlobals;

  const [{ landingPageState }, { setTotalHeight, setYScroll }] =
    fromLandingPageState;

  let speed = 0;

  setSolidContextOwner(getOwner());

  onCleanup(async () => {
    reset();
  });

  // createEffect(() => {
  //   speed = landingPageState.scrollSpeed;
  // });

  const createSketch = async (ref: HTMLDivElement) => {
    const resolution = 1;

    const app = new Application();

    setPixiApp(app);

    await app.init({
      resizeTo: ref,
      backgroundColor: 0x111827,
      resolution: resolution,

      antialias: true,
      roundPixels: false,
      eventMode: "static",
      eventFeatures: {
        move: true,
        /** disables the global move events which can be very expensive in large scenes */
        globalMove: true,
        click: true,
        wheel: false,
      },
    });

    ref.appendChild(app.canvas);

    const stage = app.stage;

    setMainStage(stage);
    setupGraphicContext();

    const newAnimation = (start: number, end: number) => ({
      start: start,
      end: end,
      timePassed: 0,
      totalTime: 10,
      easing: (t: number) => {
        if (t < 1 / 2.75) {
          return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
          return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
          return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
          return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
      },
    });

    let currentAnimation: ReturnType<typeof newAnimation>;

    const arrow = new Arrow();
    stage.addChild(arrow);

    app.ticker.add((ticker) => {
      if (speed !== landingPageState.totallyScrolled) {
        currentAnimation = newAnimation(
          speed,
          landingPageState.totallyScrolled,
        );
      }

      if (currentAnimation) {
        currentAnimation.timePassed += ticker.deltaTime;
        let normalizedTime =
          currentAnimation.timePassed / currentAnimation.totalTime;
        normalizedTime = Num.clamp(normalizedTime, 0, 1);
        speed = Num.lerp(
          currentAnimation.start,
          currentAnimation.end,
          currentAnimation.easing(normalizedTime),
        );
      }

      // speed = Math.max(speed * 3, 1);

      arrow.draw(
        {
          x: 40,
          y: 40,
        },
        speed / 3,
        1,
      );
    });
  };

  return (
    <>
      <div class="h-screen w-screen fixed" ref={(el) => createSketch(el)}></div>
    </>
  );
};
