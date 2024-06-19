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
  const [activeImage, setActiveImage] = createSignal<ImageData | null>(null);
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
              Mainly Things from 10&ndash;15 years ago. Now serving as
              Color-Swatches.
            </LandingPageSectionTitle>
          </div>
        </div>
        
        <div></div>
        <div class="px-6 grid grid-cols-26 gap-2 ">
          <For each={images()}>
            {(image, i) => (
              <div
                onClick={() => setActiveImage(image)}
                class={
                  "col-span-2 aspect-square rounded overflow-hidden group" +
                  (i() === 0 ? "col-start-1" : "")
                }
              >
                <div
                  class="w-full h-full bg-cover bg-center"
                  style={`background-image: url('/images/thumbnails/${image.file}')`}
                >
                  <div class="h-full w-[100%] grid grid-cols-3 opacity-80 group-hover:opacity-0 transition-opacity">
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
