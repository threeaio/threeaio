import { Container } from "pixi.js";
import { HorizontalLine, VerticalLine } from "./Constants";

export class SupportLines extends Container {
  mainLine = HorizontalLine();
  leftSupportLine = VerticalLine();
  rightSupportLine = VerticalLine();

  constructor() {
    super();
  }
}
