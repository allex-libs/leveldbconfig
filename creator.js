function createLib (execlib, LevelDBWithLog) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    LevelDBConfigMixin = require('./mixincreator')(execlib, LevelDBWithLog);

  function LevelDBConfig (prophash) {
    LevelDBWithLog.call(this, prophash);
    LevelDBConfigMixin.call(this, prophash);
  }
  lib.inherit(LevelDBConfig, LevelDBWithLog);
  LevelDBConfigMixin.addMethods(LevelDBConfig);
  LevelDBConfig.prototype.destroy = function () {
    LevelDBConfigMixin.prototype.destroy.call(this);
    LevelDBWithLog.prototype.destroy.call(this);
  };

  return q({
    LevelDBConfigMixin: LevelDBConfigMixin,
    LevelDBConfig: LevelDBConfig
  });
}

module.exports = createLib;
