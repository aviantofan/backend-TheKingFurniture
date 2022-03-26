const { cloudPathToFileName } = require('./converter');
const { deleteFile } = require('./fileHandler');

exports.deleteImages = (images) => {
  images.map((x) => deleteFile(cloudPathToFileName(x.path)));
};
