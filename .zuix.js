/*
 * Copyright 2020-2022 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the MIT license. See LICENSE file.
 *
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello - https://github.com/genemars
 * @version 1.0
 *
 */

const path = require('path');

const config = require('config');
const child_process = require('child_process');

const zuixConfig = config.get('zuix');
const sourceFolder = zuixConfig.get('build.input');
const buildFolder = zuixConfig.get('build.output');
const contentFolder = zuixConfig.get('build.contentFolder', 'content');

const contentSourceFolder = path.join(sourceFolder, contentFolder);
const contentBuildFolder = path.join(buildFolder, contentFolder)

const {addPage, wipeContent} = require('./.eleventy-zuix');

function collect(value, previous) {
  return previous.concat([value]);
}

module.exports = (program) => {
  program
    .command('build')
    .alias('b')
    .description('Build web application')
    .action(() => {
      // todo: should check if it's a zuix.js project
      child_process.execSync('npm run build',{
        stdio:[0, 1, 2]
      });
    });
  program
    .command('add')
    .alias('a')
    .description('Add new page')
    .requiredOption('-s, --section <section_name>', 'Page section')
    .requiredOption('-n, --name <page_name>', 'Page name')
    .option('-l, --layout <layout_template>', 'Layout template name', 'article')
    .option('-fm, --front-matter "<field>: <value>"', 'Set a front matter field value', collect, [])
    .action(addPage);
  program
    .command('wipe-content')
    .alias('wc')
    .description(`Delete all content in "${contentSourceFolder}" and "${contentBuildFolder}" folders.`)
    .action(wipeContent);
};
