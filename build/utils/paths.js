const path = require('path');

const basePath = path.resolve(__dirname, '../../themes/chandrian-color-theme/');

exports.basePath = basePath;
exports.GENERAL_STYLES_FOLDER = `${basePath}/editor-colors`;
exports.CODE_STYLES_FOLDER = `${basePath}/token-colors`;
exports.COLOR_SCHEMES_FOLDER = `${basePath}/color-schemes`;
exports.OP_PATH = path.resolve(__dirname, '../../dist');
