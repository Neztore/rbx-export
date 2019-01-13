<a href="https://discord.gg/EDXNdAT"><img src="https://img.shields.io/badge/discord-roblox%20api%20chat-blue.svg?style=flat-square" alt="Roblox API Discord"/></a>

# About
rbx-export is a small and helpful tool written in Javascript, and intended for use in Nodejs.
It allows you to easily convert a Roblox model to a file/folder structure, which is ideal to upload to Github or other code sharing services.

it's intended to make sharing code easier. If people want it, I may also add the ability to convert output files back.

It's a one file package, and uses [xml2js](https://www.npmjs.com/package/xml2js) to read in the files.
# Prerequisites
First, install [**node.js**](https://nodejs.org/en/download/current/) if you haven't already.

To install the package, run the following command to get it from NPM:

[![NPM](https://nodei.co/npm/rbx-export.png)](https://npmjs.org/package/rbx-export)

```bash
# Run this to install rbx-export locally to your repository. 
$ npm install rbx-export --save

# Run this instead to install rbx-export globally so you can use it anywhere.
$ npm install rbx-export -g
```

# Using it
### Exporting your model
In order to use this, you must first export the model you'd like to convert.

#### Getting your .rbxmx file
If you've already got your model file, skip this step.
1. Open Roblox studio
2. Navigate to the model you want to export
3. Right click on it, and click "Save to file"
4. When the dialogue pops up, select an appropriate save location and **Change "Save as"** to  `Roblox XML Model Files (*.rbxmx)`

If you don't do Step 4, it will **not** work!

#### Using this module
This module exports a single function, which takes two parameters:
`rbx-export(location, output)`

- location: `String` - Path to the file you want to convert
- output: `String` - What the output should be **called**. Defaults to "Output"

##### Example usage
```js
const exporter = require("rbx-export");
exporter("inputModel.rbmx");
```

# What this module does
It takes your file, and searches through the items, then turns them into files.

How scripts are saved:
- Script - `scriptName.server.lua`
- ModuleScript - `scriptName.lua`
- LocalScript - `scriptName.client.lua`

This is akin to more heavy duty full "Project management" tools, such as Rojo or Rofresh.

However, if it is something else, such as a part, it will be saved as `Item name.Class name`, and the content will be a dump of it's properties.
If an item has children, they will be saved within a folder under the same name, minus an extension.

**If you have items with the same name, you will experience unexpected behaviour.**

This format is an adaptable standard. Expect it to change extensively.
## Support
Got questions? Feel free to open an issue, or DM me on Discord. My name is `Neztore#6998`. Alternatively, you can find me in the [Roblox API](https://discord.gg/EDXNdAT) server.