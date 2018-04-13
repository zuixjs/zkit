var staticSite = require('static-site')

staticSite({
    build: '../docs',
    source: './',
    files: ['html', 'css', 'js', 'md', 'svg'],
    ignore: ['inc','build.js']
}, function(err, stats) {
    console.log(err, stats); // {pages: [...], source: '', build: '', start: 1434175863750, end: 1434175863770, duration: 20}
});