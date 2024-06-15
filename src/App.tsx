import "cal-sans";
import { JSX, ParentComponent } from "solid-js";

const App: ParentComponent = (props: { children?: JSX.Element }) => {
  return (
    <div class="h-screen">
      <header class="fixed text-3a-paper top-0 z-10">
        {/*<ul class="hidden md:flex md:space-x-4 list-none">*/}
        {/*  <li>*/}
        {/*    <A*/}
        {/*      class="text-base font-normal  list-none hover:text-gray-100"*/}
        {/*      href="grid-editor"*/}
        {/*    >*/}
        {/*      Current*/}
        {/*    </A>*/}
        {/*  </li>*/}
        {/*  <li>*/}
        {/*    <A*/}
        {/*      class="text-base font-normal list-none hover:text-gray-100"*/}
        {/*      href="old/2d"*/}
        {/*    >*/}
        {/*      Old 2D*/}
        {/*    </A>*/}
        {/*  </li>*/}
        {/*  <li>*/}
        {/*    <A*/}
        {/*      class="text-base font-normal list-none hover:text-gray-100"*/}
        {/*      href="old/3d"*/}
        {/*    >*/}
        {/*      Old 3D*/}
        {/*    </A>*/}
        {/*  </li>*/}
        {/*</ul>*/}
      </header>
      {props.children}
    </div>
  );
};

export default App;
