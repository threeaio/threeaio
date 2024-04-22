/* @refresh reload */
import {render} from "solid-js/web";

import "./index.css";
import {Route, Router} from "@solidjs/router";
import App from "./App";
import {LandingPage} from "./features/landing-page/Landing-Page";
import {GridNew} from "./features/grid/Grid-New";
import {DrawGridCorner} from "./features/grid/grid-draw/Grid-Corner-Pixi";
import {Grid} from "./features/grid/_old/Grid";
import {DrawGridPixiCorner} from "./features/grid/grid-draw/_old/_DrawGridPixiCorner";
import {DrawGrid3D} from "./features/grid/grid-draw/_old/_DrawGrid3D";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router root={App}>
      <Route path="" component={LandingPage}></Route>
      <Route path="/grid-editor" component={GridNew}>
        <Route path="" component={DrawGridCorner} />
      </Route>
      <Route path="/old" component={Grid}>
        <Route path="2d" component={DrawGridPixiCorner} />
        <Route path="3d" component={DrawGrid3D} />
      </Route>
    </Router>
  ),
  root!,
);
