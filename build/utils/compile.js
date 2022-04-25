const fs = require("fs");
const jsonc = require("jsonc-parser");
const template = require("json-templates");

function parseTemplateString(preimage, colors) {
  const templated = template(preimage)(colors);
  const parsed = jsonc.parse(templated);
  return parsed;
}

function parseContents(fileName, colors) {
  const contents = fs.readFileSync(fileName, "utf8");
  // console.log("preimage")
  // console.log(contents)
  return parseTemplateString(contents, colors);
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
    const solarizedContents = fs.readFileSync(
      `${paths.basePath}/solarized-palette.jsonc`, "utf8"
    );
    const solarizedColors = jsonc.parse(solarizedContents);
    const contents = fs.readFileSync(
      `${paths.COLOR_SCHEMES_FOLDER}/${fileName}`,
      "utf8"
    );
    const scheme = jsonc.parse(contents);
    const base = {
      name: `${scheme.name} Chandrian`,
      type: scheme.type,
      colors: {},
      tokenColors: [],
    };

    const preTemplateColors = scheme.colors;
    const colors = parseTemplateString(JSON.stringify(preTemplateColors), solarizedColors);

    const outputFileName = `${scheme.name.toLowerCase()}-chandrian`;

    let generalStyleFiles = fs.readdirSync(paths.GENERAL_STYLES_FOLDER);
    generalStyleFiles = generalStyleFiles.filter((fname,i) => {
        if (scheme.type == "light")
          return fname.includes("light") // only keep light files
        if (scheme.type == "dark")
          return !fname.includes("light") // ignore light files
      })
      
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

    console.log("Build complete.");
  });
};
