const fs = require('fs');
const jsonc = require('jsonc-parser');
const template = require('json-templates');

function parseContents(fileName, colors) {
    const contents = fs.readFileSync(fileName, 'utf8');
    const templated = template(contents)(colors);
    const parsed = jsonc.parse(templated);
    return parsed;
}

function stripItalics(colorList) {
    return colorList.map((col)=> {
        const dupe = Object.assign({}, col);
        delete dupe.settings.fontStyle;
        return dupe;
    });
}
module.exports = function compile(paths) {
    const colorSchemeFiles = fs.readdirSync(paths.COLOR_SCHEMES_FOLDER);
    colorSchemeFiles.forEach((fileName)=> {
        const contents = fs.readFileSync(`${paths.COLOR_SCHEMES_FOLDER}/${fileName}`, 'utf8');
        const scheme = jsonc.parse(contents);
        // console.log(scheme, contents);
        const base = {
            name: `Chandrian ${scheme.name}`,
            type: scheme.type,
            colors: {
        
            },
            tokenColors: []
        };
        const colors = scheme.colors;
        const outputFileName = `chandrian-${scheme.name.toLowerCase()}`;

        const generalStyleFiles = fs.readdirSync(paths.GENERAL_STYLES_FOLDER);
        const generalColors = generalStyleFiles.reduce((accum, fileName)=> {
            const contents = parseContents(`${paths.GENERAL_STYLES_FOLDER}/${fileName}`, colors);
            Object.assign(accum, contents);
            return accum;
        }, {});
        base.colors = generalColors;

        const codeStyleFiles = fs.readdirSync(paths.CODE_STYLES_FOLDER);
        const codeColors = codeStyleFiles.reduce((accum, fileName)=> {
            const contents = parseContents(`${paths.CODE_STYLES_FOLDER}/${fileName}`, colors);
            accum = accum.concat(contents);
            return accum;
        }, []);
        base.tokenColors = codeColors;

        const opFile = `${paths.OP_PATH}/${outputFileName}.json`;
        fs.writeFileSync(opFile, JSON.stringify(base, null, 2), 'utf8');

        const deitalicized = Object.assign({}, base, {
            name: `Chandrian ${scheme.name} (no italics)`,
            tokenColors: stripItalics(base.tokenColors),
        });
        fs.writeFileSync(`${paths.OP_PATH}/${outputFileName}-no-italics.json`, JSON.stringify(deitalicized, null, 2), 'utf8');

        console.log('Build complete. Writing ', opFile);

    });
};
