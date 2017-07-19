function createLib (execlib) {
  return execlib.loadDependencies('client', ['allex_leveldbwithloglib'], require('./creator').bind(null, execlib));
}

module.exports = createLib;
