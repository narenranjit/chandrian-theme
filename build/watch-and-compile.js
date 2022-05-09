const fs = require('fs');
const compile = require('./utils/compile');
const paths = require('./utils/paths');
compile(paths);

fs.watch(paths.basePath, {
    recursive: true
}, (evt, fileName) => {
    console.log('Changed', fileName);
    compile(paths);
});
