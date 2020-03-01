const package =  require('../package.json');
const fs = require('fs');
package.version = '0.0.11';

fs.writeFile('../package.json', JSON.stringify(package), (err) => {
    console.log('Data written to file');
});

console.log(package)
