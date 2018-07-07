const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser');
const template = require('json-templates');

const basePath = path.resolve(__dirname, '../themes/chandrian-color-theme/');
const generalStylesDir = `${basePath}/editor-colors`;
const codeStylesDir = `${basePath}/token-colors`;
const outputFile = path.resolve(__dirname, '../dist/chandrian-color-theme.json');

function parseContents(fileName, colors) {
    const contents = fs.readFileSync(fileName, 'utf8');
    const templated = template(contents)(colors);
    const parsed = jsonc.parse(templated);
    return parsed;
}

function compile() {

    const colorsFile = fs.readFileSync(`${basePath}/color-definitions.jsonc`, 'utf8');
    const colors = jsonc.parse(colorsFile);
    const base = {
        name: 'chandrian',
        type: 'dark',
        colors: {
	
        },
        tokenColors: [ ]
    };

    const generalStyleFiles = fs.readdirSync(generalStylesDir);
    const generalColors = generalStyleFiles.reduce((accum, fileName)=> {
        const contents = parseContents(`${generalStylesDir}/${fileName}`, colors);
        Object.assign(accum, contents);
        return accum;
    }, {});
    base.colors = generalColors;

    const codeStyleFiles = fs.readdirSync(codeStylesDir);
    const codeColors = codeStyleFiles.reduce((accum, fileName)=> {
        const contents = parseContents(`${codeStylesDir}/${fileName}`, colors);
        accum = accum.concat(contents);
        return accum;
    }, []);
    base.tokenColors = codeColors;

    console.log('Build complete');
    fs.writeFileSync(outputFile, JSON.stringify(base, null, 2), 'utf8');
}

compile();
fs.watch(basePath, {
    recursive: true
}, (evt, fileName)=> {
    console.log('Changed', fileName);
    compile();
});
