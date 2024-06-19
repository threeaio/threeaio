import { HugeText } from "../components/HugeText";
import { LandingPageSectionTitle } from "../components/Landing-Page-Section-Title";
import { PrivateGalleryHorizontal } from "./PrivateGalleryHorizontal";

export const PrivateStuff = () => {
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

        <PrivateGalleryHorizontal />
      </div>
    </div>
  );
};
