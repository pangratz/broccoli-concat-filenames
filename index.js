var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var helpers = require('broccoli-kitchen-sink-helpers')
var Writer = require('broccoli-writer')

module.exports = ConcatFilenames

ConcatFilenames.prototype = Object.create(Writer.prototype)
ConcatFilenames.prototype.constructor = ConcatFilenames
function ConcatFilenames(inputTree, options) {
  if (!(this instanceof ConcatFilenames)) return new ConcatFilenames(inputTree, options)
  this.inputTree = inputTree
  this.inputFiles = options.inputFiles;
  this.outputFile = options.outputFile;
  this.transform = options.transform;
}

ConcatFilenames.prototype.write = function (readTree, destDir) {
  var self = this
  return readTree(this.inputTree).then(function (srcDir) {
    var output = []

    var inputFiles = helpers.multiGlob(self.inputFiles, { cwd: srcDir })
    for (i = 0; i < inputFiles.length; i++) {
      var fileName = inputFiles[i];
      var bareFileName = fileName;
      var lastDotIndex = fileName.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        bareFileName = fileName.slice(0, lastDotIndex);
      }

      output.push(self.transform(bareFileName, fileName));
    }

    helpers.assertAbsolutePaths([self.outputFile])
    mkdirp.sync(path.join(destDir, path.dirname(self.outputFile)))
    fs.writeFileSync(path.join(destDir, self.outputFile), output.join("\n"))
  });
}
