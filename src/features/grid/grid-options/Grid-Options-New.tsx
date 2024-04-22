import { Component, onMount } from "solid-js";

import { initFlowbite } from "flowbite";
import { fromStadiumState } from "../grid-context/Grid-Store";
import { RighDrawer } from "@3a/grid/ui";

export const GridOptionsNew: Component = () => {
  // https://github.com/themesberg/tailwind-solidjs-starter/issues/1
  onMount(() => {
    initFlowbite();
  });

  const [{ stadiumState }] = fromStadiumState;

  return (
    <div>
      <RighDrawer title="Settings">Hallo</RighDrawer>
    </div>
  );
};
