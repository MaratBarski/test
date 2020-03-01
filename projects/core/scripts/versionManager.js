const packegePath = '../package.json';
const package =  require(packegePath);
const fs = require('fs');

function incrementVersion(version) {
    let num = (parseInt(version.split('.').join('')) + 1).toString();
    while (num.length < 6) {
        num = '0' + num;
    }
    let res = [];
    for (let i = 0; i < num.length; i++) {
        if (i > 0 && i % 2 === 0) {
            res.push('.');
        }
        res.push(num.charAt(i));
    }
    return res.join('');
}

package.version = incrementVersion(package.version);

fs.writeFile(packegePath, JSON.stringify(package), (err) => {
    console.log(`New version: ${package.version}`);
});

module.exports.incrementVersion = incrementVersion;