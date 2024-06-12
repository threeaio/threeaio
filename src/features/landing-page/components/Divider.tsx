import { getRandomFloat } from "@3a/utils";

export const Divider = () => {
  const style = `transform: perspective(500px) rotateY(${getRandomFloat(0, 20, 0)}deg) rotateZ(${getRandomFloat(-3, 3, 0)}deg);`;

  return (
    <div class="overflow-x-hidden py-24">
      <div class="h-2 bg-3a-green  w-[200%]" style={style}></div>
    </div>
  );
};
