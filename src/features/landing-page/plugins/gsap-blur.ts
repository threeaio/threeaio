import { gsap } from "gsap";

export const GsapBlur = () => {
  const blurProperty = gsap.utils.checkPrefix("filter"),
    blurExp = /blur\((.+)?px\)/,
    getBlurMatch = (target: gsap.TweenTarget) =>
      ((gsap.getProperty(target, blurProperty) || "") as string).match(
        blurExp,
      ) || [];

  gsap.registerPlugin({
    name: "blur",
    get(target: gsap.TweenTarget) {
      return +getBlurMatch(target)[1] || 0;
    },
    init(target: gsap.TweenTarget, endValue: string) {
      let data = this,
        filter = gsap.getProperty(target, blurProperty) as string,
        endBlur = "blur(" + endValue + "px)",
        match = getBlurMatch(target)[0],
        index;
      if (filter === "none") {
        filter = "";
      }
      if (match) {
        index = filter.indexOf(match);
        endValue =
          filter.substr(0, index) +
          endBlur +
          filter.substr(index + match.length);
      } else {
        endValue = filter + endBlur;
        filter += filter ? " blur(0px)" : "blur(0px)";
      }
      // @ts-ignore
      data.target = target;
      // @ts-ignore
      data.interp = gsap.utils.interpolate(filter, endValue);
    },
    render(
      progress: any,
      data: {
        target: { style: { [x: string]: any } };
        interp: (arg0: any) => any;
      },
    ) {
      data.target.style[blurProperty] = data.interp(progress);
    },
  });
};
