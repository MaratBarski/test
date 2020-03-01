const relative = require('path');
//const Bundler = require('scss-bundle');
const Bundler = require('bundle-js');
const writeFile = require('fs-extra');

async function bundleScss() {
    // console.log(Bundler.Bundler)
    // return;
    // const res = await Bundler({
    //     entry : '../mdc-core/projects/core/src/lib/styles/scss/components/admin-table.scss',
    //     dest : 'C:/AAA/bundle.js',
    //     print : false,
    //     disablebeautify : false
    // })
    //.Bundler('../src/lib/styles/scss/components/admin-table.scss', ['../src/**/*.scss']);

    const res = await Bundler({
        entry: 'C:/AAA/1.txt',
        dest: 'C:/AAA/bundle.txt',
        print: false,
        disablebeautify: true
    })

    await Bundler({
        entry: 'C:/AAA/2.txt',
        dest: 'C:/AAA/bundle.txt',
        print: false,
        disablebeautify: true
    })

    console.log(res.imports);
    // if (res.imports) {
    //     const cwd = process.cwd();

    //     const filesNotFound = res.imports
    //         .filter(x => !x.found)
    //         .map(x => relative(cwd, x.filePath));

    //     if (filesNotFound.length) {
    //         console.error(`SCSS imports failed \n\n${filesNotFound.join('\n - ')}\n`);
    //         throw new Error('One or more SCSS imports failed');
    //     }
    // }

    // if (found) {
    //     await writeFile('./dist/_theme.scss', bundledContent);
    // }
}

bundleScss();