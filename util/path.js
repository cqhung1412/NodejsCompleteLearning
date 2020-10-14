const path = require('path');

// process.mainModule is deprecated
module.exports = path.dirname(require.main.filename); // This is root directory