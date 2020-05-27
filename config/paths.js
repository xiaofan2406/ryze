const path = require('path');

const appRoot = path.join(__dirname, '..');
const appSrc = path.join(appRoot, 'src');
const appDist = path.join(appRoot, 'dist');

module.exports = {
  appRoot,
  appSrc,
  appDist,
};
