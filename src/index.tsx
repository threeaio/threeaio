/* @refresh reload */
import {render} from "solid-js/web";

import "./index.css";
import {Route, Router} from "@solidjs/router";
import App from "./App";
import {Grid} from "./grid/Grid";
import {GridNew} from "./grid/Grid-New";
import {DrawGridCorner} from "./grid/grid-draw/GridCornerPixi";
import {DrawGrid3D} from "./grid/grid-draw/_DrawGrid3D";
import {DrawGridPixiCorner} from "./grid/grid-draw/_DrawGridPixiCorner";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={GridNew}>
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
