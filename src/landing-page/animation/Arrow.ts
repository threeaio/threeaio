import { Container } from "pixi.js";
import { VerticalLine } from "./Animation-Graphics-Contextes";
import { getRandomFloat } from "../../_util/generic.functions";
import { Num } from "pts";

// defaut is left to right with a length of 1
export class Arrow extends Container {
  public arrowWidth: number = 0;
  public dir: 1 | -1 = 1;
  private HeadSize = 10;
  private line = VerticalLine();
  private headLeft = VerticalLine();
  private headRight = VerticalLine();

  constructor() {
    super();
    this.x = getRandomFloat(0, 1900);
    this.y = getRandomFloat(0, 1000);
    this.constructArrow();
    this.rotation = Math.PI / 2;
  }

  public draw() {
    // this.alpha = Math.abs(this.arrowWidth * 0.0006);

    this.line.scale = {
      x: this.arrowWidth,
      y: 1,
    };
    this.headLeft.x = this.arrowWidth;
    this.headRight.x = this.arrowWidth;

    const arrowSize = Num.clamp(this.arrowWidth, -this.HeadSize, this.HeadSize);
    // this.arrowWidth < this.HeadSize ? this.arrowWidth : this.HeadSize;

    this.headLeft.scale = {
      x: arrowSize, // size
      y: 1,
    };
    this.headRight.scale = {
      x: arrowSize, // size
      y: 1,
    };
  }

  private constructArrow() {
    this.addChild(this.line);
    this.addChild(this.headLeft);
    this.addChild(this.headRight);
    this.headLeft.scale = {
      x: this.HeadSize, // size
      y: 1,
    };
    this.headRight.scale = {
      x: this.HeadSize, // size
      y: 1,
    };
    // this.headLeft.pivot = { x: 0, y: 0 };
    // this.headRight.pivot = { x: 0, y: 0 };

    this.headLeft.rotation = (Math.PI * 3) / -4;
    this.headRight.rotation = (Math.PI * 3) / 4;
  }
}
