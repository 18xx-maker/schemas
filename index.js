#!/usr/bin/env node
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });

const chalk = require("chalk");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const pkg = require("./package.json");
const { program } = require("commander");

// Load Schemas
const gameSchema = require("./schemas/game.schema.json");
const tilesSchema = require("./schemas/tiles.schema.json");

// Compile Schemas
const validateGame = ajv.compile(gameSchema);
const validateTiles = ajv.compile(tilesSchema);

const validate = (file) => {
  if (!fs.existsSync(file)) {
    console.log(`${path.basename(file)}: ${chalk.yellow("not found")}`);
    return false;
  }

  let json;

  try {
    json = require(file);
  } catch (err) {
    console.log(`${path.basename(file)}: ${chalk.red("error loading file")}`);
    console.log(err.message);
    console.log();
    return false;
  }

  const isGame = !!json.info;

  const validate = isGame ? validateGame : validateTiles;

  const valid = validate(json);
  const color = valid ? chalk.green : chalk.red;
  const result = valid ? "valid" : "invalid";

  console.log(`${path.basename(file)}: ${color(result)}`);

  if (!valid) {
    console.log();
    console.log(validate.errors);
    console.log();
  }

  return valid;
};

// Global program options
program.version(pkg.version, "-v, --version", "output the current version");

// Pass in a list of files to validate
program.arguments("<files...>").action((files) => {
  process.exit(
    files
      .flatMap((file) => glob.sync(file))
      .map(validate)
      .every((x) => x)
      ? 0
      : 1
  );
});

program.parse();
