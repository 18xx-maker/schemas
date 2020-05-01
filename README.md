# 18xx-schemas

This repository contains the game and tile schemas that 18xx-maker uses for it's
game files.

# CLI Usage

Install this package gives you a `18xx-schemas` binary that takes in any number
of globs and validates each file it can find. If a file doesn't exist it just
ignores it. It then pretty prints the validation output using ansi colors on the
terminal.

```shell
# Validate some files
18xx-schemas games/*.json tiles/**/*.json config.json

# Display all options
18xx-schemas -h

# Output version
18xx-schemas -v
```

Be warned that if you pass a json that doesn't conform to any of the 18xx-maker
json schemas it will be validated against the tiles schema.

# Programatic Usage

You can use this package in your javascript to validate game files using two
functions:

```javascript
const validate = require("18xx-schemas");

// If you have some json you can validate it directly:
const json = require("18Awesome.json");
let result = validate(json);

// If you want to include data in the result you can optionally pass the file used:
result = validate(json, "18Awesome.json");

// Or you can use a helper which will load the json from a file:
result = validate.file("18Awesome.json");

// In either case you get a result object that looks like:
// {
//   valid: true if validation succeeded (boolean)
//   id: the schema id of the schema used to validate this file (string)
//   file: the filename of the file loaded (not available on validate unless you pass it in) (string)
//   error: error message if we had trouble reading the passed in file (only on validate.file) (string)
//   validationErrors: error object from ajv which has all validation errors in it (object)
// }
```
