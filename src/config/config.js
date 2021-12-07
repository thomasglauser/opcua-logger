const AJV = require('ajv');
const fs = require('fs-extra');
const path = require('path');

const loc = path.resolve(process.cwd(), 'config.json');

let load = () => {
    let file = fs.readFileSync(loc);
    let text;

    text = JSON.parse(file);

    // validate the resulting JSON against the config schema
    let schema = require('../schema/configschema.json');
    let ajv = new AJV();

    if (!ajv.validate(schema, text)) {
        throw new Error(ajv.errors[0].dataPath + ': ' + ajv.errors[0].message);
    }

    return text;
};

module.exports = { load };
