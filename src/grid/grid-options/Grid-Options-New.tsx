import { Component, onMount } from "solid-js";

import { RighDrawer } from "@grid/ui";
import { initFlowbite } from "flowbite";
import { useGridNew } from "../context/Grid-Context-New";

export const GridOptionsNew: Component = () => {
  // https://github.com/themesberg/tailwind-solidjs-starter/issues/1
  onMount(() => {
    initFlowbite();
  });

  const [{ stadiumState }] = useGridNew();

  return (
    <div>
      <RighDrawer title="Settings">Hallo</RighDrawer>
    </div>
  );
};
