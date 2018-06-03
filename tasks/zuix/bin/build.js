/*
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

const staticSite = require('static-site');
const util = require('util');
const tlog = require('../lib/logger');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const measureTime = require('measure-time');

// Current package info
const pkg = require(process.cwd()+'/package.json');
tlog.term
    .bgDefaultColor()
    .defaultColor(util.format('^B%s^: v%s ^w%s^:\n',
        pkg.name, pkg.version, pkg.homepage));

// Configuration
tlog.info('^+Configuration')
    .br();
const config = require('config');
const zuixConfig = config.get('zuix');
const sourceFolder = zuixConfig.get('build.input');
const buildFolder = zuixConfig.get('build.output');
const copyFiles = zuixConfig.get('build.copy');
const ignoreFiles = zuixConfig.get('build.ignore');
const compileFiles = zuixConfig.get('build.compile');
tlog.br('   ^Ginput^ %s', sourceFolder);
tlog.br('  ^Goutput^ %s', buildFolder);
tlog.br('    ^Gcopy^ %s', copyFiles);
tlog.br('  ^Gignore^ %s', ignoreFiles);
tlog.br('  ^Gcompile^ %s', compileFiles)
    .br();
if (!fs.existsSync(sourceFolder)) {
    tlog.error('   "%s" does not exist', sourceFolder);
    process.exitCode = -1;
    return false;
}

// Build start
tlog.info('^+Copying base files from "%s" to "%s" ...', sourceFolder, buildFolder)
    .br().br();

// Copy files straight to the build folder without processing them
for (let i = 0; i < copyFiles.length; i++) {
    const path = copyFiles[i];
    const source = util.format('%s/%s', sourceFolder, path);
    const destination = util.format('%s/%s', buildFolder, path);
    tlog.overwrite('   | "%s" -> "%s"', source, destination);
    copyFolder(source, destination);
}

// Copy zuix-dist files and 'config.json'
tlog.overwrite('   | "%s" -> "%s"', 'zuix-dist', 'js');
copyFolder(util.format('%s/node_modules/zuix-dist/js', process.cwd()), util.format('%s/js/zuix', buildFolder));
copyAppConfig();
tlog.overwrite(' ^G\u2713^: done').br();

const getElapsed = measureTime();
tlog.info('^+Generating files ...');

// Parse and compile to static all other files
staticSite({
    build: buildFolder,
    source: sourceFolder,
    ignore: ignoreFiles.concat(copyFiles),
    files: compileFiles,
    helpers: ['tasks/zuix/helpers/zuix-context.js'],
    templateEngine: 'tasks/zuix/engines/zuix-bundler.js'
}, function(err, stats) {
    tlog.term.defaultColor('\n\n');
    if (err != null) {
        tlog.term.bgBrightWhite().red('Error^: '+err+'\n');
        tlog.stats().error++;
    }
    const elapsed = getElapsed().millisecondsTotal;
    const count = stats.pages.length;
    tlog.term.defaultColor(util.format(
        'Generated ^B%s^: %s in ^B%s^:^w ms^:.\n%s ^r%s^: %s, ^y%s^: %s.\n\n',
        count,
        plural('file', count !== 1 ? 's' : ''),
        elapsed,
        tlog.stats().error === 0 ? '^G\u2713^:' : '^R*^:',
        tlog.stats().error,
        plural('error', tlog.stats().error),
        tlog.stats().warn,
        plural('warning', tlog.stats().warn),
    ));
    process.exitCode = tlog.stats().error;
});

function copyAppConfig() {
    let cfg = 'zuix.store("config", ';
    cfg += JSON.stringify(config.get('zuix.app'), null, 4);
    cfg += ');\n';
    fs.writeFileSync(buildFolder+'/config.js', cfg);
}

// destination type must match source (dir/dir or file/file)
function copyFolder(source, destination, done) {
    const ncp = require('ncp').ncp;
    // ncp.limit = 16;
    // ncp.stopOnErr = true;
    let folder = destination;
    if (fs.existsSync(source)) {
        if (fs.lstatSync(source).isFile()) {
            folder = path.dirname(destination);
        }
        if (!fs.existsSync(folder)) {
            mkdirp.sync(folder);
            tlog.overwrite('   ^wcreated folder "%s"', folder)
                .br();
        }
    } else {
        tlog.overwrite();
        tlog.warn('   ^w"%s" not found', source)
            .br();
        // TODO: handle return value
        return false;
    }
    ncp(path.resolve(process.cwd(), source), path.resolve(process.cwd(), destination), function(err) {
        if (typeof done === 'function') {
            done(err);
        }
    });
}

function plural(s, n) {
    return s+(n !== 1 ? 's' : '');
}
