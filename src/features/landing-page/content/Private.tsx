import { HugeText } from "../components/HugeText";
import imageData from "/src/assets/images.json";
import { createSignal, For } from "solid-js";
import { LandingPageSectionTitle } from "../components/Landing-Page-Section-Title";

type ImageData = {
  file: string;
  from: string;
  to: string;
  black: string;
  white: string;
  colors: string[];
};

export const PrivateStuff = () => {
  const [images] = createSignal(imageData as ImageData[]);
  return (
    <div id="private-stuff">
      <div class="px-6 md:px-0">
        <div class="w-full grid grid-cols-26">
          <div class="col-span-26 md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5 ">
            <HugeText>
              <h2>
                Some things I did for the food.{" "}
                <span class="text-3a-green">Some Things I do for the fun.</span>
              </h2>
            </HugeText>
          </div>
        </div>
        <div class="grid grid-cols-26 gap-2 ">
          <div class="tile-heading col-span-full md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5">
            <LandingPageSectionTitle>
              Mainly Things from more then 10 years ago.
            </LandingPageSectionTitle>
          </div>
        </div>
        <div class="px-6 grid grid-cols-26 gap-2 ">
          {/*<div class="col-span-4">*/}
          {/*  <div class="grid grid-cols-1 gap-2 ">*/}
          {/*    <div class="aspect-square rounded overflow-hidden">*/}
          {/*      <div*/}
          {/*        class="w-full h-full bg-cover bg-center"*/}
          {/*        style={`background-image: url(${swissImage})`}*/}
          {/*      ></div>*/}
          {/*    </div>*/}
          {/*    <div class="aspect-square rounded overflow-hidden">*/}
          {/*      <div*/}
          {/*        class="w-full h-full e bg-cover bg-center"*/}
          {/*        style={`background-image: url(${baderImage})`}*/}
          {/*      ></div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}

          <For each={images()}>
            {(image, i) => (
              <div
                class={
                  "col-span-2 aspect-square rounded overflow-hidden " +
                  (i() === 0 ? "col-start-1" : "")
                }
              >
                <div
                  class="w-full h-full bg-cover bg-center"
                  style={`background-image: url('/images/thumbnails/${image.file}')`}
                >
                  <div class="h-full w-[50%] grid grid-cols-3 ">
                    <div class="h-full grid grid-rows-2 ">
                      <div style={`background-color: ${image.black}`}></div>
                      <div style={`background-color: ${image.white}`}></div>
                    </div>
                    <div class="h-full grid grid-rows-2 ">
                      <div style={`background-color: ${image.from}`}></div>
                      <div style={`background-color: ${image.to}`}></div>
                    </div>
                    <div class="h-full grid grid-rows-4 ">
                      <For each={image.colors}>
                        {(color, j) => (
                          <div style={`background-color: ${color}`}></div>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};
