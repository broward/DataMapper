'use strict';

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
const fs = require('fs');
const jsonfile = require('jsonfile');
const flat = require('flat');

const keyFile = "keymaps/ABC.json";
const dataFile = "datamaps/ABC.json";
const inputFile = "inputs/ABC.json";
const outputFile = "outputs/ABC.json";

var temp = null;
var input = null;
var keyMap = null;
var dataMap = null;


const server = http.createServer((req, res) => {

  // read our mappings
  temp = fs.readFileSync(keyFile);
  keyMap = JSON.parse(temp);

  temp = fs.readFileSync(dataFile);
  dataMap = JSON.parse(temp);

  // read input file
  temp = fs.readFileSync(inputFile);
  input = JSON.parse(temp);

  // flatten input data
  var result = flat.flatten(input);
  console.log("my flatten input:" + JSON.stringify(result));

  // transform keys
  var output = new Object();

  for (const key in result) {
    var value = result[key];

    var newKey = keyMap[key];
    if (newKey != null) {
      output[newKey] = value;
    }
  }

  // unflatten
  result = flat.unflatten(output);
  console.log("my unflatten input:" + result);

  // transform data
  for (const key in result) {
    var value = result[key];

    var transformer = dataMap[key];
    if (transformer != null) {
      console.log("my transformer is " + transformer);
      result[key] = Transformers[transformer](value);
    }
  }

  // write output
  jsonfile.writeFile(outputFile, result, {
    spaces: 2
  }, function(err) {
    if (err) console.error(err)
  })

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end("whats up");
});

// transform functions
var Transformers = {
  convertToBoolean: function(value) {
    if (value == 0) {
      return false;
    } else {
      return true;
    }
  },
  func2: function() {
    alert('Function 2');
  },
  func3: function() {
    alert('Function 3');
  },
  func4: function() {
    alert('Function 4');
  },
  func5: function() {
    alert('Function 5');
  }
};


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
