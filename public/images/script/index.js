const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const chroma = require("chroma-js");

const getColors = require("get-image-colors");

const directoryPath = path.join(__dirname, "../");
const tnDirectoryPath = path.join(__dirname, "../thumbnails/");

const NUM_COLORS = 4;

fs.readdir(directoryPath, async (err, files) => {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  let imageData = [];
  const parse = async () => {
    //listing all files
    for (const file of files) {
      // Do whatever you want to do with the file
      if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
        if (!fs.existsSync(tnDirectoryPath + file)) {
          await sharp(path.join(__dirname, "../", file))
            .resize(500, 500, {
              fit: sharp.fit.cover,
              position: sharp.strategy.entropy,
            })
            .toFile(tnDirectoryPath + file);
        }

        let colors = await getColors(path.join(tnDirectoryPath + file), {
          count: NUM_COLORS,
        });
        const hexColors = colors.map((color) => color.hex());
        const colorsByLuminance = hexColors.sort(
          (a, b) => chroma(b).hsl()[2] - chroma(a).hsl()[2],
        );
        const colorsByIntensity = hexColors.sort(
          (a, b) =>
            chroma(b).hsi()[1] / 1.5 +
            chroma(b).hsi()[2] -
            chroma(a).hsi()[1] / 1.5 -
            chroma(a).hsi()[2],
        );

        const closestToWhite = hexColors
          .map((color) => ({
            color,
            value: chroma.distance("#fff", color),
          }))
          .toSorted((a, b) => a.value - b.value)
          .at(0).color;

        const closestToBlack = hexColors
          .map((color) => ({
            color,
            value: chroma.distance("#000", color),
          }))
          .toSorted((a, b) => a.value - b.value)
          .at(0).color;

        const colorsWithDistance = colorsByIntensity
          .map((color) => {
            return {
              color,
              matches: colorsByIntensity
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
          .toSorted((a, b) => a.matches.value - b.matches.value)
          .at(-1);

        const darkestToBrightest = chroma
          .scale([colorsByIntensity[0], colorsByIntensity.at(-1)])
          .mode("lch")
          .colors(4);
        imageData.push({
          file,
          colors: colorsByIntensity,
          from: colorsWithDistance.color,
          to: colorsWithDistance.matches.color,
          white: closestToWhite,
          black: closestToBlack,
        });
      }
    }
  };

  const writeJson = (data) => {
    fs.writeFileSync(
      "../../../src/assets/images.json",
      JSON.stringify(data, null, 2),
    );
  };

  await parse();

  imageData.sort(() => Math.random() - 0.5);
  writeJson(imageData);
});
