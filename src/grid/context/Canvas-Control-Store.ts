import { CanvasControl } from "../types/types";
import { createStore } from "solid-js/store";
import { batch } from "solid-js";

const initialState: CanvasControl = {
  el: null,
  view: {
    x: 0,
    y: 0,
    zoom: 1,
    width: 0,
    height: 0,
  },
  viewPos: { prevX: null, prevY: null, isDragging: false },
};

export const makeControlContext = (initialState: CanvasControl) => {
  const elId = "CanvasControlArea";

  const elByAttr = `.${elId}`;

  const [controlState, setControlState] =
    createStore<CanvasControl>(initialState);

  const setupControls = (el: HTMLDivElement) => {
    el.classList.add(elId);

    el.removeEventListener("wheel", (e) => zoom(e));
    el.removeEventListener("mousedown", (e: MouseEvent) => mousePressed(e));
    el.removeEventListener("mousemove", (e: MouseEvent) => mouseDragged(e));
    el.removeEventListener("mouseup", (e: MouseEvent) => mouseReleased());
    el.removeEventListener("mouseleave", (e: MouseEvent) => mouseReleased());

    el.addEventListener("wheel", (e) => zoom(e));
    el.addEventListener("mousedown", (e: MouseEvent) => mousePressed(e));
    el.addEventListener("mousemove", (e: MouseEvent) => mouseDragged(e));
    el.addEventListener("mouseup", (e: MouseEvent) => mouseReleased());
    el.addEventListener("mouseleave", (e: MouseEvent) => mouseReleased());

    setControlState({
      ...initialState,
      view: {
        ...initialState.view,
        width: el.clientWidth,
        height: el.clientHeight,
      },
      el,
    });

    new ResizeObserver((args) => {
      const cr = args[0].contentRect;
      setControlState("view", {
        width: cr.width,
        height: cr.height,
      });
    }).observe(el);
  };

  const zoom = (e: WheelEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(elByAttr)) {
      return;
    }

    const { x, y, deltaY } = e;
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 0.1;
    const zoom = 1 * direction * factor;

    const wx =
      (x - controlState.view.x) /
      (controlState.view.width * controlState.view.zoom);
    const wy =
      (y - controlState.view.y) /
      (controlState.view.height * controlState.view.zoom);

    setControlState("view", {
      zoom: Math.max(controlState.view.zoom + zoom, 0.2),
      x: controlState.view.x - wx * controlState.view.width * zoom,
      y: controlState.view.y - wy * controlState.view.height * zoom,
    });

    e.preventDefault();
    e.stopImmediatePropagation();
  };

  const mousePressed = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(elByAttr)) {
      return;
    }
    // is batch needed?
    batch(() => {
      setControlState("viewPos", "isDragging", true);
      setControlState("viewPos", "prevX", e.clientX);
      setControlState("viewPos", "prevY", e.clientY);
    });
  };

  const mouseDragged = (e: MouseEvent) => {
    const { prevX, prevY, isDragging } = controlState.viewPos;
    if (!isDragging) {
      return;
    }

    const pos = { x: e.clientX, y: e.clientY };
    const dx = pos.x - (prevX || 0); // distance X
    const dy = pos.y - (prevY || 0); // distance Y

    if (prevX || prevY) {
      const cvx = controlState.view.x;
      const cvy = controlState.view.y;
      // is batch needed?
      batch(() => {
        setControlState("view", "x", cvx + dx);
        setControlState("view", "y", cvy + dy);
        setControlState("viewPos", "prevX", pos.x);
        setControlState("viewPos", "prevY", pos.y);
      });
    }
  };

  const mouseReleased = () => {
    setControlState("viewPos", {
      isDragging: false,
      prevX: null,
      prevY: null,
    });
  };

  return [
    {
      controlState,
    },
    { setupControls },
  ] as const;
};

type CanvasControlContextType = ReturnType<typeof makeControlContext>;

export const fromControlState: CanvasControlContextType =
  makeControlContext(initialState);
