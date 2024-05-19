import { gsap } from "gsap";
import { onMount } from "solid-js";

export const LogoAnarchy = (props: {}) => {
  const circle =
    "M471.75,213.5c-83.119,0-150.5,67.381-150.5,150.5s67.381,150.5,150.5,150.5,150.5-67.381,150.5-150.5-67.381-150.5-150.5-150.5ZM471.75,493c-71.245,0-129-57.755-129-129s57.755-129,129-129,129,57.755,129,129-57.755,129-129,129Z";

  const pathA =
    "555.5 410.75 517.004 305.75 516.5 305.75 504.752 337.793 517.201 371.75 492.371 371.75 485.405 390.75 524.167 390.75 531.5 410.75 555.5 410.75";

  const arrow1 =
    "416.752 410.75 440.752 410.75 479.248 305.75 455.248 305.75 416.752 410.75";

  const arrow2 =
    "385.752 410.75 409.752 410.75 448.248 305.75 424.248 305.75 385.752 410.75";

  const arrow3 =
    "447.752 410.75 471.752 410.75 510.248 305.75 486.248 305.75 447.752 410.75";

  const convertToArrowStart = (points: string): string => {
    const pArrowLeft = points.split(" ").map((s) => parseFloat(s));

    const pArrowLeftStart = [...pArrowLeft];
    // pArrowLeftStart[0] = pArrowLeftStart[4];
    // pArrowLeftStart[1] = pArrowLeftStart[5];
    // pArrowLeftStart[2] = pArrowLeftStart[6];
    // pArrowLeftStart[3] = pArrowLeftStart[7];

    const diffX = pArrowLeft[6] - pArrowLeft[0];
    const diffY = pArrowLeft[7] - pArrowLeft[1];

    const getTupleList = (list: number[]) => {
      const grouped: number[][] = list
        .reduce((prev, curr, index) => {
          if (!(index % 2)) {
            prev.push([curr]);
          } else {
            // @ts-ignore
            prev.at(-1).push(curr);
          }
          return prev;
        }, [] as number[][])
        .map((tuple, tupleIndex, all) => {
          // skip the 2 start-points of the arrows
          if (tupleIndex > 1 && tupleIndex < all.length - 1) {
            return [tuple[0] - diffX, tuple[1] - diffY];
          }
          return tuple;
        });
      return grouped;
    };

    return getTupleList(pArrowLeftStart)
      .flatMap((s) => s)
      .join(" ");
  };

  onMount(() => {
    const svgArrowOrigin = "top right";
    const xTypoOffset = -40;
    const typoTimeOffset = ">-=.05";
    const circleTimeOffset = "=.2";
    const arrowTimeOffset = ">-0.03";
    const tl1 = gsap.timeline({
      // yoyo: true,
      // repeat: 2,
      defaults: { opacity: 0, duration: 0.25, ease: "back.out(1.1)" },
    });
    tl1
      .from(
        ".b_2",
        {
          attr: {
            points: convertToArrowStart(arrow2),
          },
          transformOrigin: svgArrowOrigin,
        },
        arrowTimeOffset,
      )
      .addLabel("startArrow");
    tl1.from(
      ".b_1",
      {
        attr: {
          points: convertToArrowStart(arrow1),
        },
        transformOrigin: svgArrowOrigin,
      },
      arrowTimeOffset,
    );
    tl1.from(
      ".b_3",
      {
        attr: {
          points: convertToArrowStart(arrow3),
        },
        transformOrigin: svgArrowOrigin,
      },
      arrowTimeOffset,
    );
    tl1.from(".a_1", { x: xTypoOffset }, typoTimeOffset).addLabel("startText");
    tl1.from(
      ".circle",
      {
        scale: 0.8,
        transformOrigin: "center center",
        duration: 0.6,
        ease: "back.out(2.7)",
      },
      circleTimeOffset,
    );
  });

  return (
    <div class="w-full">
      <svg viewBox="0 0 962 721">
        <g class="all" style="transform-origin: 50% 50%; transform: scale(2)">
          <polygon class="logo-main-color b_2" points={arrow2} />
          <polygon class="logo-main-color b_1" points={arrow1} />
          <polygon class="logo-main-color b_3" points={arrow3} />
          <polygon class="logo-main-color a_1" points={pathA} />
          <path class="logo-main-color circle" d={circle} />
        </g>
      </svg>
    </div>
  );
};
