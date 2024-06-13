import { gsap } from "gsap";
import { onMount } from "solid-js";

export const LogoArrows = (props: {}) => {
  let element!: HTMLDivElement;

  const arrow1 =
    "32.146 377.785 35.624 381.379 415.21 14.053 415.855 32.759 415.855 32.759 420.852 32.587 419.933 5.926 393.272 5.007 393.1 10.004 411.548 10.64";

  const arrow2 =
    "156.72 377.785 160.197 381.379 539.783 14.053 540.428 32.759 540.428 32.759 545.425 32.587 544.506 5.926 517.845 5.007 517.673 10.004 536.121 10.64";

  const arrow3 =
    "281.293 377.785 284.77 381.379 664.357 14.053 665.002 32.759 669.998 32.587 669.998 32.587 669.079 5.926 642.418 5.007 642.246 10.004 660.694 10.64";
  const convertToArrowStart = (points: string): string => {
    const pArrowLeft = points.split(" ").map((s) => parseFloat(s));

    const pArrowLeftStart = [...pArrowLeft];
    // pArrowLeftStart[0] = pArrowLeftStart[4];
    // pArrowLeftStart[1] = pArrowLeftStart[5];
    // pArrowLeftStart[2] = pArrowLeftStart[6];
    // pArrowLeftStart[3] = pArrowLeftStart[7];

    const diffX = pArrowLeft[4] - pArrowLeft[0];
    const diffY = pArrowLeft[5] - pArrowLeft[1];

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
        .map((tuple, tupleIndex) => {
          // skip the 2 start-points of the arrows
          if (tupleIndex > 1) {
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

  const standardDuration = 0.25;
  const tl1 = gsap.timeline({
    yoyo: true,
    repeat: 100,
    defaults: { opacity: 0, duration: standardDuration, ease: "back.out(1.5)" },
  });

  const stop = () => {
    // tl1.yoyo(false);
    tl1.repeat(0);
  };

  const run = () => {
    tl1.yoyo(true);
    tl1.repeat(100);
    tl1.play(0);
  };

  onMount(() => {
    const svgArrowOrigin = "top right";
    const xTypoOffset = -30;
    const typoTimeOffset = "-=.19";
    const arrowTimeOffset = ">-0.17";

    const el = (_el: string) => element.querySelector(_el);

    tl1
      .to(element, { opacity: 1, duration: 0.5 })
      .from(el(".logo-text__t"), {
        x: xTypoOffset,
      })
      .addLabel("startText")
      .from(
        el(".logo-text__h"),
        {
          x: xTypoOffset,
        },
        typoTimeOffset,
      )
      .from(el(".logo-text__r"), { x: xTypoOffset }, typoTimeOffset)
      .from(
        el(".logo-text__e1"),
        { x: xTypoOffset, delay: (0 * standardDuration) / 2 },
        typoTimeOffset,
      )
      .from(el(".logo-text__e2"), { x: xTypoOffset }, typoTimeOffset)
      .from(el(".logo-text__a"), { x: xTypoOffset }, typoTimeOffset)
      .from(
        el(".logo-text__dot"),
        { x: xTypoOffset * -1.6, delay: 0.1, ease: "back.out(2.5)" },
        typoTimeOffset,
      )
      .from(
        el(".logo-arrows__left"),
        {
          attr: {
            points: convertToArrowStart(arrow1),
          },
          duration: standardDuration,
          transformOrigin: svgArrowOrigin,
        },
        "startText+=.2s",
      )
      .addLabel("startArrow")
      .from(
        el(".logo-arrows__middle"),
        {
          attr: {
            points: convertToArrowStart(arrow2),
          },
          duration: standardDuration * 1.2,
          transformOrigin: svgArrowOrigin,
        },
        arrowTimeOffset,
      )
      .from(
        el(".logo-arrows__right"),
        {
          attr: {
            points: convertToArrowStart(arrow3),
          },
          duration: standardDuration * 1,
          transformOrigin: svgArrowOrigin,
        },
        arrowTimeOffset,
      )
      .from(element, { opacity: 1, duration: 1 });
    tl1.pause(tl1.endTime());
  });

  return (
    <div
      ref={element}
      class="w-full w-full-arrows"
      onMouseEnter={run}
      onMouseLeave={stop}
    >
      <svg viewBox="-200 -20 1077.5 600">
        <g class="logo-text">
          <path
            class="logo-text__t logo-main-color"
            d="M42.949,526.92c-7.175,0-12.702-1.853-16.583-5.557-3.881-3.705-5.821-8.849-5.821-15.436v-47.983H6.432v-20.287h14.113v-26.813h21.698v26.813h20.287v20.287h-20.287v43.573c0,2.001.468,3.47,1.411,4.41.94.942,2.409,1.411,4.41,1.411h14.465v19.581h-19.581Z"
          />
          <path
            class="logo-text__h logo-main-color"
            d="M79.11,526.92v-123.486h21.521v42.691h.882c1.998-2.586,5.204-4.939,9.614-7.057,4.41-2.116,9.377-3.175,14.906-3.175,6.819,0,12.905,1.56,18.258,4.675,5.35,3.117,9.526,7.497,12.525,13.143,2.999,5.645,4.499,12.172,4.499,19.581v53.628h-21.522v-50.806c0-5.761-1.825-10.496-5.469-14.201-3.646-3.704-8.233-5.557-13.76-5.557-5.645,0-10.38,1.883-14.201,5.646-3.823,3.765-5.733,8.468-5.733,14.112v50.806h-21.521Z"
          />
          <path
            class="logo-text__r logo-main-color"
            d="M179.838,526.92v-89.263h18.523l1.764,7.586h.882c3.528-5.056,8.937-7.586,16.229-7.586h16.406v20.287h-14.995c-5.645,0-9.939,1.499-12.878,4.498-2.941,2.999-4.41,7.382-4.41,13.143v51.335h-21.522Z"
          />
          <path
            class="logo-text__e1 logo-main-color"
            d="M259.221,522.687c-6.94-3.997-12.379-9.526-16.317-16.583-3.942-7.056-5.91-14.994-5.91-23.814s1.968-16.759,5.91-23.815c3.938-7.057,9.377-12.583,16.317-16.582,6.938-3.997,14.642-5.998,23.109-5.998,8.231,0,15.701,1.94,22.404,5.821,6.703,3.881,11.965,9.203,15.788,15.965,3.821,6.765,5.733,14.319,5.733,22.669,0,3.881-.295,6.88-.882,8.996h-66.859c.821,6.235,3.468,11.32,7.938,15.26,4.468,3.941,9.76,5.909,15.876,5.909,4.468,0,8.438-.939,11.908-2.822,3.468-1.88,5.968-4.173,7.498-6.88h22.051c-2.47,7.409-7.263,13.908-14.377,19.493-7.117,5.587-16.142,8.379-27.079,8.379-8.467,0-16.171-1.998-23.109-5.997ZM304.734,474.703c-.59-5.998-2.941-10.995-7.057-14.995-4.118-3.996-9.234-5.997-15.348-5.997-6.469,0-11.819,1.971-16.053,5.909-4.234,3.941-6.822,8.97-7.762,15.083h46.219Z"
          />
          <path
            class="logo-text__e2 logo-main-color"
            d="M357.832,522.687c-6.94-3.997-12.379-9.526-16.317-16.583-3.942-7.056-5.91-14.994-5.91-23.814s1.968-16.759,5.91-23.815c3.938-7.057,9.377-12.583,16.317-16.582,6.938-3.997,14.642-5.998,23.109-5.998,8.231,0,15.701,1.94,22.404,5.821,6.703,3.881,11.965,9.203,15.788,15.965,3.821,6.765,5.733,14.319,5.733,22.669,0,3.881-.295,6.88-.882,8.996h-66.859c.821,6.235,3.468,11.32,7.938,15.26,4.468,3.941,9.76,5.909,15.876,5.909,4.468,0,8.438-.939,11.908-2.822,3.468-1.88,5.968-4.173,7.498-6.88h22.051c-2.47,7.409-7.263,13.908-14.377,19.493-7.117,5.587-16.142,8.379-27.079,8.379-8.467,0-16.171-1.998-23.109-5.997ZM403.345,474.703c-.59-5.998-2.941-10.995-7.057-14.995-4.118-3.996-9.234-5.997-15.348-5.997-6.469,0-11.819,1.971-16.053,5.909-4.234,3.941-6.822,8.97-7.762,15.083h46.219Z"
          />
          <path
            class="logo-text__a logo-highlight-color"
            d="M454.679,522.862c-6.351-3.881-11.351-9.35-14.995-16.405-3.646-7.057-5.468-15.111-5.468-24.168s1.822-17.112,5.468-24.168c3.644-7.057,8.644-12.525,14.995-16.406,6.35-3.881,13.407-5.821,21.168-5.821,5.998,0,11.26,1.119,15.789,3.352,4.525,2.235,8.084,5.058,10.674,8.468h.881l1.764-10.056h18.699v89.263h-18.699l-1.764-10.231h-.881c-2.59,3.528-6.148,6.411-10.674,8.644-4.529,2.232-9.791,3.352-15.789,3.352-7.762,0-14.818-1.94-21.168-5.821ZM495.342,501.429c4.41-4.879,6.615-11.26,6.615-19.14s-2.205-14.259-6.615-19.141c-4.41-4.879-9.852-7.321-16.318-7.321-6.588,0-12.084,2.442-16.494,7.321-4.41,4.882-6.615,11.263-6.615,19.141s2.205,14.261,6.615,19.14c4.41,4.882,9.906,7.321,16.494,7.321,6.467,0,11.908-2.439,16.318-7.321Z"
          />
          <path
            class="logo-text__dot logo-main-color"
            d="M565.991,526.92h-24.345v-24.168h24.345v24.168Z"
          />
        </g>
        <g class="logo-arrows">
          <polygon class="logo-arrows__left logo-main-color" points={arrow1} />
          <polygon
            class="logo-arrows__middle logo-main-color"
            points={arrow2}
          />
          <polygon class="logo-arrows__right logo-main-color" points={arrow3} />
        </g>
      </svg>
    </div>
  );
};
