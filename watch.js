const delay = require('delay');
const chokidar = require('chokidar');
const BuildingState = {
    IDLE: 0,
    RUNNING: 1,
    PENDING: 2
};
const watcher = chokidar.watch('./source', {
    ignored: /[\/\\]\./, persistent: true
});
let status = BuildingState.IDLE;

// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
watcher
    .on('change', fileChanged)
    .on('add', fileChanged);

/*
watcher
    .on('add', function(path) { log('File', path, 'has been added'); })
    .on('addDir', function(path) { log('Directory', path, 'has been added'); })
    .on('change', function(path) { log('File', path, 'has been changed'); })
    .on('unlink', function(path) { log('File', path, 'has been removed'); })
    .on('unlinkDir', function(path) { log('Directory', path, 'has been removed'); })
    .on('error', function(error) { log('Error happened', error); })
    .on('ready', function() { log('Initial scan complete. Ready for changes.'); })
    .on('raw', function(event, path, details) { log('Raw event info:', event, path, details); })
*/


buildSite();


function build() {
    status = BuildingState.RUNNING;
    const childProcess = require('child_process');
    childProcess.execFileSync('npm', ['run', 'build'], {stdio:[0, 1, 2]});
    delay(1000).then(function() {
        if (status === BuildingState.PENDING) {
            build();
        } else status = BuildingState.IDLE;
    });
}
function buildSite() {
    if (status === BuildingState.IDLE) {
        build();
    } else status = BuildingState.PENDING;
}

function fileChanged(path, stats) {
    if (stats) {
        console.log('File', path, 'changed size to', stats.size);
    }
    buildSite();
}
