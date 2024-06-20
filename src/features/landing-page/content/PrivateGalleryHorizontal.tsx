import imageData from "/src/assets/images.json";
import { createSignal, For, onMount, Show } from "solid-js";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
// import "@interactjs/inertia";

type ImageData = {
  file: string;
  from: string;
  to: string;
  black: string;
  white: string;
  colors: string[];
};

export const PrivateGalleryHorizontal = () => {
  const [activeImage, setActiveImage] = createSignal<number | null>(null);
  const [images] = createSignal(imageData as ImageData[]);

  let parallax = []; // we'll store the animations in here.

  const SIZE = 100;
  const DISTANCE = 4;
  const SIZE_L = 240;

  onMount(() => {
    for (let i = 0; i < images().length; i++) {
      parallax[i] = gsap.to(".img_" + i, {
        width: SIZE_L,
        height: SIZE_L,
        opacity: 1,
        ease: "linear",
        paused: true,
      });
    }

    const clamp = gsap.utils.clamp(0, 1);

    const updateAnimation = () => {
      parallax.forEach((animation, i) => {
        const box = document
          .querySelector(".img_" + i)!
          .getBoundingClientRect();
        const centerX = box.x + box.width / 2;

        const Pos = window.innerWidth / 2 - centerX;
        const normalize = gsap.utils.mapRange(0, window.innerWidth / 3, 1, 0);
        const nv = normalize(Math.abs(Pos));
        const clamped = clamp(nv);

        if (clamped > 0.8) {
          setActiveImage(i);
        }
        return animation.progress(clamped);
      });
    };

    updateAnimation();

    Draggable.create("#slides", {
      type: "x",
      bounds: { left: window.innerWidth / 2 - SIZE_L / 2, width: 1 },
      onDrag: updateAnimation,
      inertia: false,
      throwResistance: 0.8,
      dragResistance: 0.7,
      onRelease: function () {},
      onThrowUpdate: updateAnimation,
      // snap: snap,
    });

    window.addEventListener("resize", () => {
      Draggable.get("#slides").applyBounds({ left: innerWidth / 2, width: 1 });
      updateAnimation();
    });
  });

  return (
    <div>
      <div style={`height:${SIZE_L}px`} class="w-full overflow-hidden">
        <div
          style={`height:${SIZE_L}px`}
          id="slides"
          class="absolute  flex items-center gap-2"
        >
          <For each={images()}>
            {(image, i) => (
              <div onClick={() => console.log("click", image)}>
                <div
                  class={
                    "bg-cover rounded w-16 h-16 bg-center  opacity-10 " +
                    "img_" +
                    i()
                  }
                  style={`background-image: url('/images/thumbnails/${image.file}')`}
                ></div>
              </div>
            )}
          </For>
        </div>
      </div>
      <div>
        <div class="relative max-h-screen h-72 mt-16">
          <div class="h-full grid grid-cols-26 gap-2 ">
            <div class="h-full col-span-full md:col-span-22 md:col-start-3 2xl:col-span-18 2xl:col-start-5">
              <Show when={activeImage() !== null}>
                {(imageIndex) => (
                  <div class="w-full h-full grid grid-cols-7 rounded overflow-hidden">
                    <div
                      class="p-8 col-span-4 transition-['background-color']"
                      style={`background-color: ${images()[activeImage()].black}`}
                    >
                      <div
                        class="text-5xl font-display mb-4 transition-['color']"
                        style={`color: ${images()[activeImage()].white}`}
                      >
                        Type-Test
                      </div>
                      <p
                        class="text-sm font-extralight transition-['color']"
                        style={`color: ${images()[activeImage()].white}`}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Ad adipisci aperiam debitis et incidunt ipsa odio
                        quia ratione suscipit unde?
                      </p>
                    </div>
                    <div class="h-full grid grid-rows-2 ">
                      <div
                        class="transition-['background-color']"
                        style={`background-color: ${images()[activeImage()].black}`}
                      ></div>
                      <div
                        class="transition-['background-color']"
                        style={`background-color: ${images()[activeImage()].white}`}
                      ></div>
                    </div>
                    <div class="h-full grid grid-rows-2 ">
                      <div
                        class="transition-['background-color']"
                        style={`background-color: ${images()[activeImage()].from}`}
                      ></div>
                      <div
                        class="transition-['background-color']"
                        style={`background-color: ${images()[activeImage()].to}`}
                      ></div>
                    </div>
                    <div class="h-full grid grid-rows-4 ">
                      <For each={images()[activeImage()].colors}>
                        {(color, j) => (
                          <div
                            class="transition-['background-color']"
                            style={`background-color: ${color}`}
                          ></div>
                        )}
                      </For>
                    </div>
                  </div>
                )}
              </Show>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
