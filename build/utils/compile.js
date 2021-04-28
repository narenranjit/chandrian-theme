const fs = require("fs");
const jsonc = require("jsonc-parser");
const template = require("json-templates");

function parseContents(fileName, colors) {
  const contents = fs.readFileSync(fileName, "utf8");
  const templated = template(contents)(colors);
  const parsed = jsonc.parse(templated);
  return parsed;
}

function stripTransparency(colorList) {
  return colorList.map((col) => {
    const dupe = Object.assign({}, col);
    if (dupe.settings && dupe.settings.foreground) {
      dupe.settings.foreground = dupe.settings.foreground.slice(0, 7);
    }
    return dupe;
  });
}

function stripItalics(colorList) {
  return colorList.map((col) => {
    const dupe = Object.assign({}, col);
    delete dupe.settings.fontStyle;
    return dupe;
  });
}
module.exports = function compile(paths) {
  const colorSchemeFiles = fs.readdirSync(paths.COLOR_SCHEMES_FOLDER);
  colorSchemeFiles.forEach((fileName) => {
    const contents = fs.readFileSync(
      `${paths.COLOR_SCHEMES_FOLDER}/${fileName}`,
      "utf8"
    );
    const scheme = jsonc.parse(contents);
    // console.log(scheme, contents);
    const base = {
      name: `Chandrian ${scheme.name}`,
      type: scheme.type,
      colors: {},
      tokenColors: [],
    };
    const colors = scheme.colors;
    const outputFileName = `chandrian-${scheme.name.toLowerCase()}`;

    const generalStyleFiles = fs.readdirSync(paths.GENERAL_STYLES_FOLDER);
    const generalColors = generalStyleFiles.reduce((accum, fileName) => {
      const contents = parseContents(
        `${paths.GENERAL_STYLES_FOLDER}/${fileName}`,
        colors
      );
      Object.assign(accum, contents);
      return accum;
    }, {});
    base.colors = generalColors;

    // const semanticFiles = fs.readdirSync(paths.SEMANTICS_FOLDER);
    // const semanticColors = semanticFiles.reduce((accum, fileName)=> {
    //     const contents = parseContents(`${paths.SEMANTICS_FOLDER}/${fileName}`, colors);
    //     Object.assign(accum, contents);
    //     return accum;
    // }, {});
    // base.semanticHighlighting = true
    // base.semanticTokenColors = semanticColors;

    const codeStyleFiles = fs.readdirSync(paths.CODE_STYLES_FOLDER);
    const codeColors = codeStyleFiles.reduce((accum, fileName) => {
      const contents = parseContents(
        `${paths.CODE_STYLES_FOLDER}/${fileName}`,
        colors
      );
      accum = accum.concat(contents);
      return accum;
    }, []);
    base.tokenColors = codeColors;

    const opFile = `${paths.OP_PATH}/${outputFileName}.json`;
    fs.writeFileSync(opFile, JSON.stringify(base, null, 2), "utf8");
    console.log("Writing", opFile);

    const deitalicized = Object.assign({}, base, {
      name: `Chandrian ${scheme.name} (no italics)`,
      tokenColors: stripItalics(base.tokenColors),
    });
    const italicsPath = `${paths.OP_PATH}/${outputFileName}-no-italics.json`;
    fs.writeFileSync(
      italicsPath,
      JSON.stringify(deitalicized, null, 2),
      "utf8"
    );
    console.log("Writing", italicsPath);

    const highContrast = Object.assign({}, base, {
      name: `Chandrian ${scheme.name} High Contrast`,
      tokenColors: stripTransparency(base.tokenColors),
    });
    const highContrastPath = `${paths.OP_PATH}/${outputFileName}-high-contrast.json`;
    fs.writeFileSync(
      highContrastPath,
      JSON.stringify(highContrast, null, 2),
      "utf8"
    );
    console.log("Writing", highContrastPath);

    console.log("Build complete.");
  });
};
