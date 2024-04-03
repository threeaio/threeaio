import { JSX, ParentComponent } from "solid-js";
import { A } from "@solidjs/router";

const App: ParentComponent = (props: { children?: JSX.Element }) => {
  return (
    <div class="h-screen">
      <header class="fixed text-gray-400 top-0 z-10">
        <A href="">Current</A> &nbsp;| &nbsp;
        <A href="old/2d">2D</A> &nbsp;| &nbsp;
        <A href="old/3d">3D</A>
      </header>
      {props.children}
    </div>
  );
};

export default App;
