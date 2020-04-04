const fs = require('fs');
const path = require('path');

const structure = {
    '.data': {
        static: {
            images: {}
        }
    }
};

function makeDirIfNotExists (dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

function buildSubStructure (prefix, substructure) {
    for (const directory in substructure) {
        prefix = path.join(prefix, directory);
        makeDirIfNotExists(prefix);
        buildSubStructure(prefix, substructure[directory]);
    }
}

function buildStructure () {
    buildSubStructure('', structure);
};

module.exports = buildStructure;
