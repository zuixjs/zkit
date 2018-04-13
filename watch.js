const staticSite = require('static-site');
const fs = require('fs');

buildSite();
fs.watch('./source', {recursive: true}, function(event, filename) {
    buildSite();
});

function buildSite() {
    staticSite({
        build: 'docs',
        source: 'source',
        files: ['html', 'css', 'js', 'md', 'svg'],
        ignore: ['inc','build.js'],
        helpers: ['helpers/subfolder_root.js']
    }, function(err, stats) {
        console.log(err, stats); // {pages: [...], source: '', build: '', start: 1434175863750, end: 1434175863770, duration: 20}
    });
}