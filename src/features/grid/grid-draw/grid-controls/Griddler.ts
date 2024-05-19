import { Container, Rectangle } from "pixi.js";
import { Group, Line, Pt } from "pts";
import { GriddlerSegments } from "./Griddler-Segments";
import { GriddlerSupportLines } from "./Griddler-Support-Lines";
import { GriddlerEndDrag } from "./Griddler-End-Drag";
import { AddButton } from "./Add-Button";
import { fromControlState } from "@3a/canvas-control";
import {
  DraggerRadius,
  EndDraggerDistance,
  GriddlerDistance,
  PlusIconDistance,
  PlusIconSize,
} from "../../Constants";
import { ThreeAPointLike } from "@3a/types";
import { magnitudeBy2Points } from "@3a/utils";

type GriddlerProps = {
  stage: Container;
  start: Pt;
  end: Pt;
  dir: 1 | -1;
  linesAt: number[];
  handleLineUpdate: (
    xNew: number,
    index: number,
    origPoint: ThreeAPointLike,
  ) => void;
  handleAddElement?: () => void;
  handleEndUpdate?: (xNew: number) => void;
};

export class Griddler extends Container {
  private state = {
    isHovered: false,
    currentAlpha: 1,
  };

  private supportLines!: GriddlerSupportLines;
  private gridLines!: GriddlerSegments;
  private addButton!: AddButton;
  private endDragger: GriddlerEndDrag | undefined;
  private baseLine!: Group;

  constructor(private props: GriddlerProps) {
    super({
      alpha: 1,
      isRenderGroup: true,
      interactive: true,
      hitArea: new Rectangle(0, 0, 1, 1),
      onmouseenter: (e) => {
        this.state.isHovered = true;
      },
      onmouseleave: (e) => {
        this.state.isHovered = false;
      },
    });
    this.setupChildren();
  }

  // Receiver
  public updateWidth = (x: number) => {
    this.state.currentAlpha = 1;
    this.baseLine[1].x = x;
  };

  // Receiver
  public updateLines = (_lines: number[]) => {
    if (_lines.length !== this.gridLines.lines.length) {
      this.gridLines.setNewLines(_lines);
    }
    this.gridLines.lines = _lines;
  };

  public draw() {
    const scale = fromControlState[0].controlState.view.zoom;

    const lineTransformed = this.baseLine.clone();

    const topLeft = { x: lineTransformed[0].x, y: lineTransformed[0].y };
    const topRight = { x: lineTransformed[1].x, y: lineTransformed[1].y };
    const width = magnitudeBy2Points(lineTransformed[0], lineTransformed[1]);
    const height = GriddlerDistance / scale;

    const hitAreaHeight = Math.abs(
      height + (PlusIconDistance + PlusIconSize) / scale,
    );
    const hitAreaShape = [
      topLeft.x,
      this.props.dir > 0 ? 0 : -hitAreaHeight,
      width + (EndDraggerDistance + DraggerRadius * 2) / scale,
      hitAreaHeight,
    ];
    const hitAreaRect = new Rectangle(...hitAreaShape);

    this.hitArea = hitAreaRect;
    // debug hit area
    // if (this.children[3]) {
    //   this.removeChildAt(3);
    // }
    //
    // this.addChildAt(
    //   new Graphics()
    //     .rect(
    //       hitAreaShape[0],
    //       hitAreaShape[1],
    //       hitAreaShape[2],
    //       hitAreaShape[3],
    //     )
    //     .fill(0xff0000),
    //   3,
    // );

    this.addButton.draw(
      topLeft,
      width,
      height * this.props.dir,
      this.props.dir,
    );
    this.supportLines.draw(topLeft, topRight, width, height * this.props.dir);

    this.gridLines.draw(topLeft);

    if (this.endDragger) {
      this.endDragger.draw(topRight, height);
    }
  }

  private setupChildren() {
    this.supportLines = new GriddlerSupportLines();
    this.gridLines = this.getGridLines();
    this.endDragger = this.getEndDragger();
    this.addButton = this.getAddButton();

    // what is this for ?
    this.baseLine = new Group(
      new Pt(this.props.start.x, this.props.start.y),
      new Pt(this.props.end.x, this.props.end.y),
    );

    if (this.endDragger) {
      this.addChild(this.endDragger);
    }

    this.addChild(this.supportLines);
    this.addChild(this.gridLines);
    this.addChild(this.addButton);
  }

  private getAddButton() {
    return new AddButton({
      onclick: (e) => {
        this.props.handleAddElement!();
      },
    });
  }

  private getEndDragger() {
    return this.props.handleEndUpdate
      ? new GriddlerEndDrag(this.props.stage, (pt: Pt) => {
          const scale = fromControlState[0].controlState.view.zoom;
          const griddlerDistanceScaled =
            (EndDraggerDistance + DraggerRadius) / scale;
          const ptHere = pt.$subtract(griddlerDistanceScaled, 0);
          this.props.handleEndUpdate!(ptHere.x);
        })
      : undefined;
  }

  private getGridLines() {
    return new GriddlerSegments(
      this.props.linesAt,
      this.props.stage,
      (index: number) => (pt: Pt) => {
        const baseLine = this.baseLine
          .clone()
          .add(this.position)
          .rotate2D(this.rotation);
        const ptHere = pt;
        const perpendicularFromP = Line.perpendicularFromPt(baseLine, ptHere);

        const mag = magnitudeBy2Points(baseLine[0], perpendicularFromP);
        this.props.handleLineUpdate(mag, index, ptHere);
      },
      this.props.dir,
    );
  }
}
