function createLib (execlib) {
  return execlib.loadDependencies('client', ['allex:leveldbwithlog:lib'], require('./creator').bind(null, execlib));
}

module.exports = createLib;
