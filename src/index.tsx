/* @refresh reload */
import {render} from "solid-js/web";

import "./index.css";
import {Route, Router} from "@solidjs/router";
import App from "./App";
import {Grid} from "./grid/Grid";
import {DrawGrid3D} from "./grid/grid-draw/DrawGrid3D";
import {DrawGridPixi} from "./grid/grid-draw/DrawGridPixi";

const root = document.getElementById("root");

const AllPixi = () => {
  return (
    <>
      <DrawGridPixi />
    </>
  );
};
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Grid}>
        <Route path="2d" component={AllPixi} />
        <Route path="3d" component={DrawGrid3D} />
      </Route>
    </Router>
  ),
  root!,
);
