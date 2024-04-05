import { useGridNew } from "../../context/Grid-Context-New";
import { Pt } from "pts";
import { createEffect } from "solid-js";
import { Griddler } from "./Griddler";

export const CornerBottomGriddler = () => {
  const [{ stadiumState }, { setStadiumNumRows }] = useGridNew();

  let width: number = 0;
  let start: Pt;
  let end: Pt;
  let linesAt: number[];
  let updateChild = (_num: number) => {};

  const handleEndUpdate = (pt: Pt) => {
    if (pt.x > 0) {
      setStadiumNumRows(pt.x);
    }
  };

  createEffect(() => {
    updateChild(stadiumState.numRows);
  });

  const setup = () => {
    width = stadiumState.numRows + stadiumState.cutOut.y;
    start = new Pt(0, width);
    end = new Pt(stadiumState.numRows, width);
    linesAt = stadiumState.rowLinesAt;

    const { container, draw, updateWidth } = Griddler({
      stage: stadiumState.mainStage!,
      start,
      end,
      linesAt,
      dir: -1,
      handleEndUpdate,
    });

    updateChild = updateWidth;

    return {
      container,
      draw,
    };
  };

  return {
    setup,
  };
};
