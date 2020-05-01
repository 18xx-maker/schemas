#!/usr/bin/env node
const chalk = require("chalk");
const glob = require("glob");
const path = require("path");
const pkg = require("./package.json");
const { program } = require("commander");
const validate = require("./index");

const getShortSchemaName = (id) => {
  let results = id.match(/([a-z]+)\.schema\.json$/);
  return results ? results[1] : id;
};

const displayResult = ({ valid, error, validationErrors, file, id }) => {
  const color = error ? chalk.red : valid ? chalk.green : chalk.yellow;

  const result = (error ? "error" : valid ? "valid" : "invalid").padEnd(7, " ");

  const name = getShortSchemaName(id).padEnd(7, " ");

  const basename = path.basename(file);
  const dirname = path.relative(process.cwd(), path.dirname(file));

  console.log(
    `${chalk.gray(name)} ${color(result)} ${basename} ${chalk.gray(dirname)}`
  );

  if (error || validationErrors) {
    console.log();
    console.log(error || validationErrors);
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
      .map((f) => path.join(process.cwd(), f))
      .flatMap((file) => glob.sync(file))
      .map(validate.file)
      .map(displayResult)
      .every((x) => x)
      ? 0
      : 1
  );
});

program.parse();
