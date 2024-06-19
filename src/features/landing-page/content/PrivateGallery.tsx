import imageData from "/src/assets/images.json";
import { createSignal, For, Show } from "solid-js";

type ImageData = {
  file: string;
  from: string;
  to: string;
  black: string;
  white: string;
  colors: string[];
};

export const PrivateGallery = () => {
  const [activeImage, setActiveImage] = createSignal<ImageData | null>(null);
  const [images] = createSignal(imageData as ImageData[]);

  return (
    <div class={`px-6 grid gap-2 ` + (activeImage() ? "grid-cols-2" : "")}>
      <div
        class={
          `grid gap-2  ` + (activeImage() ? "grid-cols-12" : "grid-cols-26")
        }
      >
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
                <div class="h-full w-[50%] grid grid-cols-3 opacity-100 group-hover:opacity-0 transition-opacity">
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
      <Show when={activeImage()} keyed>
        {(image) => (
          <div class="relative max-h-screen row-span-4">
            <div class="w-full grid grid-cols-7 opacity-100 group-hover:opacity-0 transition-opacity">
              <div
                class="p-8 col-span-4"
                style={`background-color: ${image.black}`}
              >
                <div
                  class="text-5xl font-display mb-4"
                  style={`color: ${image.white}`}
                >
                  Type-Test
                </div>
                <p
                  class="text-sm font-extralight"
                  style={`color: ${image.white}`}
                >
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                  adipisci aperiam debitis et incidunt ipsa odio quia ratione
                  suscipit unde?
                </p>
              </div>
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
            <div class="relative p-8">
              <div class="absolute left-0 top-0 w-full h-full overflow-hidden opacity-50">
                <div
                  class="absolute w-[200%] h-[200%] -left-1/4 -top-1/4 bg-cover bg-center blur-2xl"
                  style={`background-image: url('/images/${image.file}')`}
                ></div>
              </div>
              <div class="relative ">
                <img
                  class="max-w-1/2 max-h-[500px] w-auto h-auto mx-auto"
                  src={`/images/${image.file}`}
                />
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};
