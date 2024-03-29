import {
  createContext,
  createSignal,
  JSX,
  ParentComponent,
  useContext,
} from "solid-js";
import { CanvasControl } from "../types/types";

const initialState: CanvasControl = {
  el: null,
  view: {
    x: 30,
    y: 30,
    zoom: 3,
    width: 0,
    height: 0,
  },
  viewPos: { prevX: null, prevY: null, isDragging: false },
};

export const makeControlContext = (initialState: CanvasControl) => {
  const elId = "CanvasControlArea";

  const elByAttr = `.${elId}`;

  const [controlState, setControlState] =
    createSignal<CanvasControl>(initialState);

  const setupControls = (el: HTMLDivElement) => {
    el.classList.add(elId);

    el.removeEventListener("wheel", (e) => zoom(e));
    el.removeEventListener("mousedown", (e: MouseEvent) => mousePressed(e));
    el.removeEventListener("mousemove", (e: MouseEvent) => mouseDragged(e));
    el.removeEventListener("mouseup", (e: MouseEvent) => mouseReleased());

    el.addEventListener("wheel", (e) => zoom(e));
    el.addEventListener("mousedown", (e: MouseEvent) => mousePressed(e));
    el.addEventListener("mousemove", (e: MouseEvent) => mouseDragged(e));
    el.addEventListener("mouseup", (e: MouseEvent) => mouseReleased());

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
      setControlState({
        ...controlState(),
        view: {
          ...controlState().view,
          width: cr.width,
          height: cr.height,
        },
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
    const factor = 0.02;
    const zoom = 1 * direction * factor;

    const wx =
      (x - controlState().view.x) /
      (controlState().view.width * controlState().view.zoom);
    const wy =
      (y - controlState().view.y) /
      (controlState().view.height * controlState().view.zoom);

    setControlState({
      ...controlState(),
      view: {
        ...controlState().view,
        zoom: controlState().view.zoom + zoom,
        x: controlState().view.x - wx * controlState().view.width * zoom,
        y: controlState().view.y - wx * controlState().view.height * zoom,
      },
    });
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  const mousePressed = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(elByAttr)) {
      return;
    }
    setControlState({
      ...controlState(),
      viewPos: {
        isDragging: true,
        prevX: e.clientX,
        prevY: e.clientY,
      },
    });
  };

  const mouseDragged = (e: MouseEvent) => {
    const { prevX, prevY, isDragging } = controlState().viewPos;
    if (!isDragging) {
      return;
    }
    const pos = { x: e.clientX, y: e.clientY };
    const dx = pos.x - (prevX || 0); // distance X
    const dy = pos.y - (prevY || 0); // distance Y

    if (prevX || prevY) {
      setControlState({
        ...controlState(),
        view: {
          ...controlState().view,
          x: (controlState().view.x += dx),
          y: (controlState().view.y += dy),
        },
        viewPos: {
          ...controlState().viewPos,
          prevX: pos.x,
          prevY: pos.y,
        },
      });
    }
  };

  const mouseReleased = () => {
    setControlState({
      ...controlState(),
      viewPos: {
        isDragging: false,
        prevX: null,
        prevY: null,
      },
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

export const CanvasControlContext = createContext<CanvasControlContextType>();

export const CanvasControlProvider: ParentComponent = (props: {
  children?: JSX.Element;
}) => {
  const state = makeControlContext(initialState);

  return (
    <CanvasControlContext.Provider value={state}>
      {props.children}
    </CanvasControlContext.Provider>
  );
};

export const useCanvasControl = () => {
  const value = useContext(CanvasControlContext);
  if (value === undefined) {
    throw new Error(
      "useCanvasControl must be used within a CanvasControlContext.Provider",
    );
  }
  return value;
};
