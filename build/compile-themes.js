const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser');
const template = require('json-templates');

const colors = require('../themes/chandrian-color-theme/color-definitions.json');

const base = {
    name: 'chandrian',
    type: 'dark',
    colors: {
	
    },
    tokenColors: [ ]
};

function getContents(fileName) {
    const contents = fs.readFileSync(fileName, 'utf8');
    const templated = template(contents)(colors);
    const parsed = jsonc.parse(templated);
    return parsed;
}

const basePath = path.resolve(__dirname, '../themes/chandrian-color-theme/');
const generalStylesDir = `${basePath}/editor-colors`;
const codeStylesDir = `${basePath}/token-colors`;
const outputFile = path.resolve(__dirname, '../dist/chandrian-color-theme.json');

const generalStyleFiles = fs.readdirSync(generalStylesDir);
const generalColors = generalStyleFiles.reduce((accum, fileName)=> {
    const contents = getContents(`${generalStylesDir}/${fileName}`);
    Object.assign(accum, contents);
    return accum;
}, {});
base.colors = generalColors;

const codeStyleFiles = fs.readdirSync(codeStylesDir);
const codeColors = codeStyleFiles.reduce((accum, fileName)=> {
    const contents = getContents(`${codeStylesDir}/${fileName}`);
    accum = accum.concat(contents);
    return accum;
}, []);
base.tokenColors = codeColors;

fs.writeFileSync(outputFile, JSON.stringify(base, null, 2), 'utf8');
