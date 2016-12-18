/*jshint node:true*/
var awaitCommand = require('../../lib/await-command');
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  description: 'Installs the cordova nativeStorage plugin',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var checker = new VersionChecker(this);
    var dep = checker.for('ember-cordova', 'npm');
    if (!dep.version) {
      throw new Error("ember-cordova-storage requires ember-cordova.");
    }

    return awaitCommand('ember cdv:plugin add cordova-plugin-nativestorage --save');
  }
};
