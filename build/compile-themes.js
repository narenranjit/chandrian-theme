const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser');

const colors = require('../themes/chandrian-color-theme/color-definitions.json');

const base = {
    name: 'chandrian',
    type: 'dark',
    colors: {
	
    },
    tokenColors: [ ]
};

const basePath = path.resolve(__dirname, '../themes/chandrian-color-theme/');
const generalStylesDir = `${basePath}/editor-colors`;
const codeStylesDir = `${basePath}/token-colors`;
const outputFile = path.resolve(__dirname, '../dist/chandrian-color-theme.json');

const generalStyleFiles = fs.readdirSync(generalStylesDir);
const generalColors = generalStyleFiles.reduce((accum, fileName)=> {
    const contents = fs.readFileSync(`${generalStylesDir}/${fileName}`, 'utf8');
    const parsed = jsonc.parse(contents);
    Object.assign(accum, parsed);
    return accum;
}, {});
base.colors = generalColors;

const codeStyleFiles = fs.readdirSync(codeStylesDir);
const codeColors = codeStyleFiles.reduce((accum, fileName)=> {
    const contents = fs.readFileSync(`${codeStylesDir}/${fileName}`, 'utf8');
    const parsed = jsonc.parse(contents);
    accum = accum.concat(parsed);
    return accum;
}, []);
base.tokenColors = codeColors;

fs.writeFileSync(outputFile, JSON.stringify(base, null, 4), 'utf8');

// fs.readdirSync('../themes/chandrian-color-theme');
