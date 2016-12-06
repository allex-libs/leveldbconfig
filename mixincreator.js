function createLevelDBConfigMixin (execlib, LevelDBWithLog) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  function LevelDBConfigMixin (prophash) {
    this.fields = prophash.fields.slice();
  };

  LevelDBConfigMixin.prototype.destroy = function () {
    this.fields = null;
  };

  LevelDBConfigMixin.prototype._putDefault = function(promiseArry,dfltVal,field){
    promiseArry.push(this.put(field,dfltVal));
  };

  LevelDBConfigMixin.prototype.put = function(key,value){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return LevelDBWithLog.prototype.put.call(this,key,value);
  };

  LevelDBConfigMixin.prototype.safeGet = function(key, deflt){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return LevelDBWithLog.prototype.safeGet.call(this,key,deflt);
  };

  LevelDBConfigMixin.prototype.getWDefault = function(key, deflt){
    if (this.fields.indexOf(key) < 0){
      return q.reject(new lib.Error('NOT_A_CONFIG_FIELD',key));
    }
    return LevelDBWithLog.prototype.getWDefault.call(this,key,deflt);
  };

  LevelDBConfigMixin.prototype._configPutter = function (retobj, conffieldname) {
    var _q = q,
      ret = this.safeGet(conffieldname,null).then(function (conffieldvalue) {
        var ret = _q(true);
        retobj[conffieldname] = conffieldvalue;
        _q = null;
        retobj = null;
        conffieldname = null;
        return ret;
      });
    return ret;
  };

  LevelDBConfigMixin.prototype.getConfig = function(){
    var ret = {}, promises = this.fields.map(this._configPutter.bind(this, ret));
    return q.all(promises).then(
      qlib.returner(ret)
    );
  };

  LevelDBConfigMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, LevelDBConfigMixin,
      '_putDefault',
      'put',
      'safeGet',
      'getWDefault',
      '_configPutter',
      'getConfig'
    );
  };

  return LevelDBConfigMixin;
}

module.exports = createLevelDBConfigMixin;
