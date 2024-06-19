import imageData from "/src/assets/images.json";
import { createSignal, For, onMount } from "solid-js";
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
  const [activeImage, setActiveImage] = createSignal<ImageData | null>(null);
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
        ease: "none",
        paused: true,
      });
    }

    const clamp = gsap.utils.clamp(0, 1);

    let snap = gsap.utils.pipe(
      gsap.utils.snap(SIZE * DISTANCE),
      gsap.utils.clamp(images.length * -(SIZE * DISTANCE), 0),
    );

    const updateAnimation = () => {
      parallax.forEach((animation, i) => {
        // @ts-ignore
        const box = document.querySelector(".img_" + i).getBoundingClientRect();
        const centerX = box.x + box.width / 2;

        const Pos = window.innerWidth / 2 - centerX;
        const normalize = gsap.utils.mapRange(0, window.innerWidth / 3, 1, 0);

        const nv = normalize(Math.abs(Pos));
        return animation.progress(clamp(nv));
      });
    };

    updateAnimation();

    Draggable.create("#slides", {
      type: "x",
      bounds: { left: window.innerWidth / 2, width: 100 },
      zIndexBoost: false,
      onDrag: updateAnimation,
      inertia: false,
      throwResistance: 8000,
      onRelease: function () {},
      onThrowUpdate: updateAnimation,
      snap: snap,
    });
  });

  return (
    <div style={`height:${SIZE_L}px`}>
      <div
        style={`height:${SIZE_L}px`}
        id="slides"
        class="absolute left-1/2 -translate-x-1/2 w-auto flex items-center gap-2 "
      >
        <For each={images()}>
          {(image, i) => (
            // <div
            //   class={"bg-cover bg-center absolute " + "img_" + i()}
            //   style={`background-image: url('/images/thumbnails/${image.file}'); width: ${SIZE}px; height: ${SIZE}px; left:${i() * (SIZE + DISTANCE)}px`}
            // ></div>
            <div>
              <div
                class={"bg-cover rounded w-16 h-16 bg-center " + "img_" + i()}
                style={`background-image: url('/images/thumbnails/${image.file}')`}
              ></div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
