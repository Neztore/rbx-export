// Require statements
const fs = require('fs');
const path = require("path");
const parseString = require('xml2js').parseString;
const util = require('util');
const package = require("./package")

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
const scriptTypes = {
    "ModuleScript": "module",
    "Script": "server",
    "LocalScript": "client"
};

// Converts a Roblox class/item to a folder/file structure.
function convertItem  (item, where) {
    if (Array.isArray(item)) {
        item = item[0];
    }

    // Convert the item itself
    const className = item['$'].class;
    const itemName = item.Properties[0].string[0]['_'];
    const referent = item['$'].referent
    let childPath = path.join(where, itemName);


    if (className !== "Folder") {
        // Dump the items properties into a file.
        const outProperties = {}
        const properties = Object.keys(item.Properties[0])

        for (let propType of properties) {
            const value = item.Properties[0][propType]
            for (let propItem of value) {
                const name = propItem["$"].name
                propItem["$"] = undefined
                outProperties[name] = {
                    _propertyType: propType,
                    values: propItem
                }
            }

        }

        const outObject = {
            className,
            name: itemName,
            referent,
            properties: outProperties,
            _exportInfo: `Exported with rbx-export v${package.version}. Contains all properties of this instance.`
        }
        let fileName = path.join(where, `${itemName}.${className}.model.json`);
        if (className=="Model") fileName = path.join(where, `${itemName}.model.json`)
        const propertyString = JSON.stringify(outObject, null, 1)

        if (scriptTypes[className]) {
            let classText = scriptTypes[className] !== "" ? `.${scriptTypes[className]}` : "";
            if (scriptTypes[className] == "module"){
                classText = "";
            }
            const fileName = path.join(where, `${itemName}${classText}.lua`);

            fs.writeFile(fileName, item.Properties[0].ProtectedString[0]['_'], (err) => {
                if (err) throw err;
            })

            outObject.properties.ProtectedString = undefined;
        }else{
            
            fs.writeFile(fileName, propertyString, (err) => {
                if (err) throw err;
            })
        }

        
        
    }
    // Check for any children
    if (item.Item) {
        // Create children file
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
        const json = await loadFile(location);
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
