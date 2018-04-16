const fs = require('fs');
const delay = require('delay');
const BuildingState = {
    IDLE: 0,
    RUNNING: 1,
    PENDING: 2
};
let status = BuildingState.IDLE;
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

buildSite();
fs.watch('./source', {recursive: true}, function(event, filename) {
    console.log(new Date().toLocaleTimeString(), event, filename);
    buildSite();
});
