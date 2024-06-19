const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const sharp = require("sharp");
const chroma = require("chroma-js");
const getColors = require("get-image-colors");

const directoryPath = path.join(__dirname, "../");
const tnDirectoryPath = path.join(__dirname, "../thumbnails/");
const jsonTargetPath = path.join(__dirname, "../../../src/assets/images.json");

const NUM_COLORS = 4;
const THUMBNAIL_SIZE = 400;

/**
 *
 * @param file {string}
 * @returns {Promise<void>}
 */
const createThumbNail = async (file) => {
  if (!fs.existsSync(tnDirectoryPath + file)) {
    await sharp(path.join(__dirname, "../", file))
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: sharp.fit.cover,
        position: sharp.strategy.entropy,
      })
      .toFile(tnDirectoryPath + file);
  }
};

/**
 * @param file {string}
 * @returns {boolean}
 */
const fileIsImage = (file) => file.match(/\.(jpg|jpeg|png|gif)$/i);

/**
 * @param listOfColors {Array<string>}
 * @param colorToCompareTo {string}
 * @returns {string}
 */
const getBestMatchingColor = (listOfColors, colorToCompareTo = "#fff") => {
  return listOfColors
    .map((color) => ({
      color,
      value: chroma.distance(colorToCompareTo, color),
    }))
    .toSorted((a, b) => a.value - b.value)
    .at(0).color;
};

/**
 * @param listOfColors {Array<string>}
 * @returns {Array<{color: string, matches: Array<{color: string, value: number}>}>}
 */
const getColorsWithTheirContrastToEachOtherColor = (listOfColors) => {
  return listOfColors
    .map((color) => {
      return {
        color,
        matches: listOfColors
          .map((color2) => {
            return {
              color: color2,
              value: chroma.deltaE(color, color2),
            };
          })
          .toSorted((a, b) => a.value - b.value)
          .at(-1),
      };
    })
    .toSorted((a, b) => a.matches.value - b.matches.value);
};

/**
 * Main
 * @returns {Promise<void>}
 */
const main = async () => {
  const files = await fsPromises.readdir(directoryPath).catch(console.error);
  const imageData = [];

  for (const file of files) {
    if (fileIsImage(file)) {
      await createThumbNail(file).catch(console.error);

      let colors = await getColors(path.join(tnDirectoryPath + file), {
        count: NUM_COLORS,
      });
      const hexColors = colors.map((color) => color.hex());

      const colorsByLuminance = hexColors.toSorted(
        (a, b) => chroma(b).luminance() - chroma(a).luminance(),
      );

      const colorsByIntensity = hexColors.toSorted(
        (a, b) =>
          chroma(b).hsi()[1] +
          chroma(b).hsi()[2] / 1.5 -
          chroma(a).hsi()[1] -
          chroma(a).hsi()[2] / 1.5,
      );

      const largestContrast =
        getColorsWithTheirContrastToEachOtherColor(colorsByIntensity).at(-1);

      const brightestToDarkest = chroma
        .scale([colorsByLuminance[0], colorsByLuminance.at(-1)])
        .mode("lch")
        .colors(4);

      const closestToWhite = getBestMatchingColor(hexColors, "#fff");
      const closestToBlack = getBestMatchingColor(hexColors, "#000");

      imageData.push({
        file,
        colors: hexColors,
        from: largestContrast.color,
        to: largestContrast.matches.color,
        white: brightestToDarkest.at(0),
        black: brightestToDarkest.at(-1),
      });
    }
  }

  const writeJson = (data) => {
    fs.writeFileSync(jsonTargetPath, JSON.stringify(data, null, 2));
  };

  imageData.sort(() => Math.random() - 0.5);
  writeJson(imageData);
};

main();
