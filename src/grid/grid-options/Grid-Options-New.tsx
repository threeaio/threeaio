import { Component, onMount } from "solid-js";

import { RighDrawer } from "@grid/ui";
import { initFlowbite } from "flowbite";
import { fromStadiumState } from "../context/grid/Grid-Store";

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
