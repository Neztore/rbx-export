// Require statements
const fs = require('fs');
const path = require("path");
const parseString = require('xml2js').parseString;
const util = require('util');

// Converts the given XML file to JSON, using xml2js.
function loadFile(fileLoc) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fileLoc, function(err, data) {
            if (err) return reject(err);
            parseString(data, function (err, result) {
                if (err) return reject(err);
                resolve(result.roblox.Item);
            });
        });
    });
}
// Converts JSON to directories.
const scriptTypes = [
        "ModuleScript", "Script", "LocalScript"
];

// Converts a Roblox class/item to a folder/file structure.
function convertItem  (item, where) {
    if (Array.isArray(item)) {
        item = item[0];
    }

    // Convert the item itself
    const className = item['$'].class;
    const itemName = item.Properties[0].string[0]['_'];
    if (scriptTypes.includes(className)) {
        const fileName = path.join(where, `${itemName}-${className}.lua`);
        fs.writeFile(fileName, item.Properties[0].ProtectedString[0]['_'], (err) => {
            if (err) throw err;
        })
    } else {
        // It's not a script. Dump the items properties into a file.
        let propertyString = `${className}: ${itemName}\n\n`;
        const fileName = path.join(where, `${itemName}.${className}`);
        for (let type of item.Properties) {
            // Type is the property type, e.g string.
            propertyString += `${util.inspect(type, false)}}\n\n`;

        }
        fs.writeFile(fileName, propertyString, (err) => {
            if (err) throw err;
        })
    }
    // Check for any children
    if (item.Item) {
        // Create children file
        const childPath = path.join(where, itemName);
        if (!fs.existsSync(childPath)) {
            fs.mkdirSync(path.join(childPath));
        }
        for (let child of item.Item) {
            convertItem(child, childPath);
        }
    }
}
// The main run point
async function run (location, output) {
    try {
        output = output || "Output";
        const json = await convertFile(location);
        const outputDir = path.join(__dirname, output);
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        convertItem(json, outputDir);
    } catch (e) {
        console.error(e);
    }

}
module.exports = run;