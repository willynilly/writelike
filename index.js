var myLib = require('./lib.js');

function main() {
  var fs = require('fs');
  var argv = require('minimist')(process.argv.slice(2));
  var fileName = argv.f || argv.file;
  var maxWordCount = argv.w || argv.wordcount;

  if (fileName) {
    fs.readFile(fileName, "utf-8", (err, data) => {
      if (err) throw err;
      var text = myLib.author(data, maxWordCount);
      console.log(text);
    });
  }
}

main();
