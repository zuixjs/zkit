const staticSite = require('static-site');
console.log(new Date().toLocaleTimeString(), 'Building started...');
staticSite({
    build: 'docs',
    source: 'source',
    files: ['html', 'css', 'js', 'md', 'svg'],
    ignore: ['css', 'images', 'lib', '_inc', 'docs/_inc'],
    helpers: ['helpers/subfolder_root.js']
}, function(err, stats) {
    console.log(err, stats); // {pages: [...], source: '', build: '', start: 1434175863750, end: 1434175863770, duration: 20}
});
copyFolder('./source/css', './docs/css');
copyFolder('./source/images', './docs/images');
copyFolder('./source/lib', './docs/lib');
// TODO: should wait sync
// console.log(new Date().toLocaleTimeString(), '... building complete.');

function copyFolder(source, dest) {
    console.log('Copying "'+source+'" to "'+dest+'" ...');
    const path = require('path');
    const ncp = require('ncp').ncp;
    // ncp.limit = 16;
    ncp(path.resolve(__dirname, source), path.resolve(__dirname, dest), function(err) {
        if (err) {
            return console.error(err);
        }
        console.log('... done!');
    });
}