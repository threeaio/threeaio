export const GridIndicator = () => {
  return (
    <div class="w-full hidden md:block">
      <div class="grid grid-cols-26 relative z-20">
        <div class="relative md:col-span-11 md:col-start-3 2xl:col-span-6 2xl:col-start-5 ">
          <div class="absolute left-0 h-4 w-px bg-3a-white"></div>
          <div class="absolute right-0 h-4 w-px bg-3a-white"></div>
        </div>
        <div class="relative md:col-span-11 2xl:col-span-6">
          <div class="absolute right-0 h-4 w-px bg-3a-white"></div>
        </div>
        <div class="relative md:hidden 2xl:block 2xl:col-span-6">
          <div class="absolute right-0 h-4 w-px bg-3a-white"></div>
        </div>
      </div>
    </div>
  );
};
