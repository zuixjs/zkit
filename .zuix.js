/*
 * Copyright 2020-2022 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
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
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 * @version 1.0
 *
 */

const fs = require('fs');
const path = require('path');
const {chalk, render, mkdirp, highlight, classNameFromHyphens} = require('zuix-cli/common/utils');
const config = require('config');
const moment = require('moment');
const yesno = require('yesno');
const child_process = require('child_process');

const destinationFolder = 'pages';

const zuixConfig = config.get('zuix');
const sourceFolder = zuixConfig.get('build.input');
const buildFolder = zuixConfig.get('build.output');

const contentSourceFolder = path.join(sourceFolder, destinationFolder);
const contentBuildFolder = path.join(buildFolder, destinationFolder)

function addPage(args) {
  const pageTemplatesPath = './templates/pages/';
  const template = args.layout;
  let outputFile = args.name.toLowerCase();
  const pageName = path.basename(outputFile);
  const pageTitle = classNameFromHyphens(pageName);
  console.log(
    chalk.cyanBright('*') + ' Generating',
    chalk.yellow.bold(template),
    '→',
    outputFile
  );
  let extension = '.liquid';
  let componentTemplate = `${pageTemplatesPath}${template}${extension}`;
  if (!fs.existsSync(componentTemplate)) {
    extension = '.md'
    componentTemplate = `${pageTemplatesPath}${template}${extension}`;
  }
  if (fs.existsSync(componentTemplate)) {
    let sectionFolder = path.join(sourceFolder, destinationFolder);
    if (args.section) {
      args.section = args.section.toLowerCase();
      sectionFolder = path.join(sectionFolder, args.section);
    }
    const frontMatter = args.frontMatter && args.frontMatter.join('\n') + '\n';
    const date = new moment().format('yyyy-MM-DD hh:mm:ss');
    let pageTemplate = fs.readFileSync(componentTemplate).toString('utf8');
    pageTemplate = render(pageTemplate, {
      title: pageTitle,
      name: pageName,
      section: args.section,
      frontMatter,
      date
    });
    const outputPath = path.join(sectionFolder, outputFile);
    outputFile = path.join(outputPath, 'index' + extension);
    if (!fs.existsSync(outputFile)) {
      mkdirp.sync(outputPath);
      fs.writeFileSync(outputFile, pageTemplate);
      console.log(chalk.cyanBright('*') + ' NEW page:', chalk.green.bold(outputFile));
      // Create section if it does not exist
      if (args.section) {
        const sectionFile = path.join(sectionFolder, 'index.liquid');
        if (!fs.existsSync(sectionFile)) {
          addPage({layout: 'section', name: args.section, frontMatter: [
              `group: ${args.section}`,
              `title: ${classNameFromHyphens(args.section)}`,
            ]});
        } else {
          touch(sectionFile);
        }
      }
    } else {
      console.error(
        chalk.red.bold('A file with that name already exists.')
      );
    }
  } else {
    console.error(
      chalk.red.bold('Invalid page template:', componentTemplate)
    );
  }
}

async function wipeContent() {
  const confirm = await yesno({
    question: `All content in "${contentSourceFolder}" will be deleted.\nThis action cannot be undone!\nAre you sure to proceed?`
  });
  if (confirm) {
    if (fs.existsSync(contentSourceFolder)) {
      console.log(chalk.cyanBright('*') + ' Removing', chalk.green.bold(contentSourceFolder));
      fs.rmSync(contentSourceFolder, {recursive: true});
    }
    if (fs.existsSync(contentBuildFolder)) {
      console.log(chalk.cyanBright('*') + ' Removing', chalk.green.bold(contentBuildFolder));
      fs.rmSync(contentBuildFolder, {recursive: true});
    }
    // "touch" index file to force reload
    const filename = path.join(sourceFolder, 'index.liquid');
    touch(filename);
  }
}

function touch(filename) {
  try {
    const touchStream = fs.createWriteStream(filename, {flags: 'a'});
    touchStream.close();
  } catch (err) {
    // TODO: log error
  }
}

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
