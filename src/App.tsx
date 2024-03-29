import { JSX, ParentComponent } from "solid-js";
import { A } from "@solidjs/router";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      model: [() => any, (v: any) => any];
    }
  }
}

const App: ParentComponent = (props: { children?: JSX.Element }) => {
  return (
    <div class="h-screen">
      <header class="fixed text-gray-400 top-0">
        <A href="2d">2D</A> &nbsp;| &nbsp;
        <A href="3d">3D</A>
      </header>
      {props.children}
    </div>
  );
};

export default App;
