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

/**
 * @param eleventyConfig
 */
const path = require('path');
const config = require('config');
const fs = require('fs');
const chokidar = require('chokidar');
const moment = require('moment');
const nunjucks = require('nunjucks');

const {
  compilePage,
  copyFolder,
  generateServiceWorker,
  generateAppConfig,
  wrapDom,
  wrapCss,
  generate
} = require('zuix');

const {classNameFromHyphens} = require('zuix/common/utils');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const yesno = require('yesno');

// Read configuration either from './config/{default}.json'
// or './config/production.json' based on current `NODE_ENV'
// environment variable value
let zuixConfig = config.get('zuix');
const sourceFolder = zuixConfig.get('build.input');
const buildFolder = zuixConfig.get('build.output');
const copyFiles = zuixConfig.get('build.copy');
const ignoreFiles = zuixConfig.get('build.ignore');
const componentsFolders = zuixConfig.get('build.componentsFolders');
const contentFolder = zuixConfig.get('build.contentFolder', 'content');
const contentSourceFolder = path.join(sourceFolder, contentFolder);
const contentBuildFolder = path.join(buildFolder, contentFolder)
const dataFolder = zuixConfig.get('build.dataFolder');
const includesFolder = zuixConfig.get('build.includesFolder');
// this file is a temporary file create to trigger 11ty build
const triggerFile = path.join(sourceFolder, '.zuix.build.md');
const triggerFileOut = path.join(buildFolder, '.zuix.build.tmp');
// replace {{variables}} eventually employed in the config
zuixConfig = JSON.parse(nunjucks.renderString(JSON.stringify(zuixConfig), zuixConfig));

const normalizeMarkup = (s) => s.trim().split('\n').filter((l) => {
  if (l.trim().length > 0) {
    return l;
  }
}).map((l) => l.trim()).join('\n');

function getZuixConfig() {
  return {
    sourceFolder,
    buildFolder,
    dataFolder,
    includesFolder,
    copyFiles,
    ignoreFiles,
    componentsFolders,
    baseUrl: zuixConfig.app.baseUrl,
    all: zuixConfig
  }
}

let wrappedCssIds = [];
let io;

function startWatcher(eleventyConfig, browserSync) {
  // Watch zuix.js folders and files (`./source/lib`, `./source/app`, zuixConfig.copy), ignored by 11ty
  const watchEvents = {add: true, change: true, unlink: true};
  const watchFiles = [];
  copyFiles.forEach((f) => {
    f = path.resolve(path.join(sourceFolder, f));
    watchFiles.push(f);
  });
  componentsFolders.map(f =>  {
    f = path.resolve(path.join(sourceFolder, f));
    watchFiles.push(f);
  });
  const copyFilesWatcher = chokidar.watch(watchFiles).on('all', (event, file, stats) => {
    if (watchEvents[event] && fs.existsSync(file)) {
      const outputFile = path.resolve(path.join(buildFolder, file.substring(path.resolve(sourceFolder).length)));
      const outputFolder = path.dirname(outputFile);
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
      }
      fs.copyFileSync(file, outputFile);
    } else {
      // TODO: maybe remove file from output folder as well?
    }
    if (browserSync) {
      browserSync.reload();
    }
  });
  const includes = path.join(sourceFolder, includesFolder);
  const allFilesWatcher = chokidar.watch([sourceFolder]).on('all', (event, file, stats) => {
    if (event.startsWith('unlink') && file !== triggerFile) {
      forceRebuild();
    } else if (!file.startsWith(includes) && file.indexOf(path.join('/', '_inc', '/')) !== -1) {
      forceRebuild();
    }
  });
  setupSocketApi(browserSync);
}

function setupSocketApi(browserSync) {
  // WebSocket API
  if (browserSync && !io) {
    io = browserSync.instance.io;
    io.on('connection', (socket) => {
      socket.on('zuix:loadContent', (request) => {
        const content = fs.readFileSync(request.path);
        request.content = content.toString('utf8');
        io.emit('zuix:loadContent:done', request);
        console.log('zuix:loadContent', request.path);
      });
      socket.on('zuix:saveContent', (request) => {
        fs.writeFileSync(request.path, request.content);
        io.emit('zuix:saveContent:done', {path: request.path});
        console.log('zuix:saveContent', request.path);
      });
      socket.on('zuix:addPage', (data) => {
        browserSync.notify('Adding new page...');
        addPage(data).then(() => {
          const redirectUrl = zuixConfig.app.baseUrl + contentFolder + '/' + data.section + '/';
          io.emit('zuix:addPage:done', redirectUrl);
        }).catch((err) => {
          io.emit('zuix:addPage:error', err.message);
        });
        console.log('zuix:addPage', data);
      });
      socket.on('zuix:deletePage', (data) => {
        browserSync.notify('Deleting page...');
        try {
          if (data.page.filePathStem.endsWith('/index')) {
            // delete folder too
            fs.rmSync(path.resolve(data.page.inputPath, '..'), { recursive: true, force: true });
            fs.rmSync(path.resolve(data.page.outputPath, '..'), { recursive: true, force: true });
          }
          const redirectUrl = path.resolve(data.page.url, '..');
          io.emit('zuix:deletePage:done', redirectUrl);
        } catch (e) {
          console.log(e);
          io.emit('zuix:deletePage:error', e);
        }
        console.log('zuix:deletePage', data.page.outputPath, path.resolve(data.page.url, '..'));
      });
      socket.on('zuix:addComponent', (data) => {
        browserSync.notify('Adding component...');
        const handlePromise = (promise) => {
          promise.then((res) =>  {
            generateTemplate(res);
            io.emit('zuix:addComponent:done', res);
          })
          .catch((err) => {
            io.emit('zuix:addComponent:error', err.message);
          });
        };
        if (data.view && data.ctrl) {
          handlePromise(generate('component', [data.name]));
        } else if (data.view) {
          handlePromise(generate('template', [data.name]));
        } else if (data.ctrl) {
          handlePromise(generate('controller', [data.name]));
        }
      });
    });
  }
}

function forceRebuild() {
  fs.writeFileSync(triggerFile, `---
permalink: .zuix.build.tmp
---
Temporary file to trigger 11ty build`);
}

function initEleventyZuix(eleventyConfig) {
  const postProcessFiles = [];
  const changedFiles = [];
  let rebuildAll = true;
  // Copy node_modules dependencies
  copyDependencies(zuixConfig.build.dependencies[0]);
  // Auto-generated config.js
  generateAppConfig(zuixConfig);
  // zUIx.js specific code and life-cycle hooks
  zuixConfig.app.environment = process.env.NODE_ENV || 'default';
  eleventyConfig.addGlobalData("app", zuixConfig.app);
  eleventyConfig.addWatchTarget('./templates/tags/');
  // Add zUIx transform
  eleventyConfig.addTransform('zuix-js', function(content) {
    const inputPath = this.inputPath;
    const outputPath = this.outputPath;
    const hasChanged = changedFiles.find(f => path.resolve(f) === path.resolve(inputPath));
    if (!rebuildAll && !hasChanged) return content;
    // populates a list of `.html` files
    // to be post processed after build
    if (outputPath && outputPath.endsWith('.html')) {
      let file = path.resolve(outputPath);
      const baseFolder = path.resolve(zuixConfig.build.output);
      if (file.startsWith(baseFolder)) {
        file = file.substring(baseFolder.length + 1);
      }
      postProcessFiles.push({file, baseFolder: zuixConfig.build.output});
    }
    return content;
  });
  eleventyConfig.on('eleventy.beforeWatch', (cf) => {
    // changedFiles is an array of files that changed
    // to trigger the watch/serve build
    changedFiles.length = 0;
    const baseFolder = path.resolve(zuixConfig.build.input);
    const dataFolder = path.join(baseFolder, zuixConfig.build.dataFolder);
    const includesFolder = path.join(baseFolder, zuixConfig.build.includesFolder);
    const templateChanged = cf.find(f => path.resolve(f).startsWith(includesFolder));
    const dataChanged = cf.find(f => path.resolve(f).startsWith(dataFolder));
    if (templateChanged || dataChanged) {
      rebuildAll = true;
      return;
    }
    changedFiles.push(...cf);
  });
  eleventyConfig.on('eleventy.after', async function(args) {
    console.log();
    postProcessFiles.forEach((pf) => {
      const result = compilePage(pf.file, pf.file, {
        baseFolder: pf.baseFolder,
        ...zuixConfig
      });
      // TODO: check result code and report
    });
    postProcessFiles.length = 0;
    wrappedCssIds = [];
    if (zuixConfig.build.serviceWorker) {
      console.log('Updating Service Worker... ');
      await generateServiceWorker().then(function () {
        console.log('... done.');
      });
    } else {
      console.log();
    }
    if (rebuildAll) {
      // reverts to incremental build mode
      rebuildAll = false;
    }
    // delete temporary build-trigger file if found
    if (fs.existsSync(triggerFile)) {
      fs.unlinkSync(triggerFile);
      fs.unlinkSync(triggerFileOut);
    }
    if (io) {
      io.emit('zuix:build:done');
    }
  });
  if (process.argv.indexOf('--serve') === -1) {
    // copy files in production mode
    copyFiles.forEach((f) => {
      f = path.join(sourceFolder, f);
      eleventyConfig.addPassthroughCopy(f);
    });
    componentsFolders.map(f =>  {
      f = path.join(sourceFolder, f);
      eleventyConfig.addPassthroughCopy(f);
    });
  }
  eleventyConfig.setDataDeepMerge(true);
}

function copyDependencies(dependencyList) {
  const nodeFolder = `${process.cwd()}/node_modules`;
  Object.keys(dependencyList).forEach((sourcePath) => {
    const destinationPath = dependencyList[sourcePath];
    sourcePath = path.join(nodeFolder, sourcePath);
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyFolder(sourcePath, path.join(buildFolder, destinationPath), (err) => {
        if (err) console.log(err);
      });
    } else {
      const destinationFile = path.basename(sourcePath);
      fs.copyFileSync(sourcePath, path.join(buildFolder, destinationPath, destinationFile));
    }
  });
}

function rawFileInclude(page, fileName) {
  const inputPath = path.dirname(page.inputPath);
  let rawFile = path.join(inputPath, fileName);
  if (!fs.existsSync(rawFile)) {
    rawFile = path.join(inputPath, page.fileSlug, fileName);
  }
  if (!fs.existsSync(rawFile)) {
    rawFile = path.join(zuixConfig.build.input, fileName);
  }
  if (!fs.existsSync(rawFile)) {
    rawFile = path.join(zuixConfig.build.input, zuixConfig.build.includesFolder, fileName);
  }
  if (fs.existsSync(rawFile)) {
    return normalizeMarkup(fs.readFileSync(rawFile).toString('utf8'));
  } else {
    // TODO: report error
    throw new Error('File not found');
  }
}

function renderTemplate(content, template, ...args) {
  const p = `./templates/tags/${template}.js`;
  if (fs.existsSync(p)) {
    delete require.cache[require.resolve(p)];
    return normalizeMarkup(require(p)(nunjucks.renderString, content, ...args));
  }
  return ''; // 'Not implemented! (' + content + ') [' + args + ']';
}
function generateTemplate(data) {
  const outputFile = `./templates/tags/${data.componentId}.js`;
  if (!fs.existsSync(outputFile)) {
    mkdirp.sync(path.dirname(outputFile));
    fs.writeFileSync(outputFile, `const template = '${data.html}';

module.exports = (render, content, linkUrl) => {
  return render(template, {content, linkUrl});
};
`);
  }
  data.liquid = `{% zx '${data.componentId}' %}{% endzx %}`;
}

function configure(eleventyConfig) {
  initEleventyZuix(eleventyConfig);

  /*
  || Eleventy plugins
  */
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight);

  /*
  || Add data collections
  */

  // this is used by the searchFilter
  eleventyConfig.addCollection('posts_searchIndex', (collection) => {
    return [...collection.getFilteredByGlob(path.join(zuixConfig.build.input, contentFolder, '**/*.md'))];
  });

  /*
  || Add custom data filters
  */

  // TODO: maybe scan folder and add automatically
  const filtersPath = path.resolve(sourceFolder, '_filters');
  eleventyConfig.addFilter(
    'search',
    require(path.join(filtersPath, 'searchFilter'))
  );
  eleventyConfig.addFilter(
    'date',
    (date, format) => moment(date).format(format || 'YYYY-MM-DD')
  );

  /*
  || Add short codes
  */

  eleventyConfig.addShortcode('rawFile', function(fileName) {
    return rawFileInclude(this.page, fileName);
  });

  eleventyConfig.addPairedShortcode('unpre', function(content) {
    content = content.substring(content.indexOf('```') + 3);
    content = content.substring(content.indexOf('\n') + 1);
    content = content.substring(0, content.lastIndexOf('```'));
    return normalizeMarkup(content);
  });

  eleventyConfig.addPairedShortcode('layout', function(content, ...args) {
    return `<div layout="${args[0]}" ${args[1]}>${normalizeMarkup(content)}</div>`;
  });

  eleventyConfig.addPairedShortcode('zx', function(content, template, ...args) {
    return renderTemplate(content, template, ...args);
  });

  eleventyConfig.addPairedShortcode('wrapDom', function(content, cssId) {
    return wrapDom(content, cssId);
  });
  eleventyConfig.addPairedShortcode('wrapCss', function(content, cssId, encapsulate) {
    const path = this.page.inputPath;
    const processedCss = wrappedCssIds.find((item) => item.id === cssId && item.path === path);
    if (processedCss == null) {
      wrappedCssIds.push({id: cssId, path});
      content = content.replace(/^\s+|\s+$/g, '');
      let styleTag = false;
      if (content.startsWith('<style')) {
        styleTag = content.substring(0, content.indexOf('>') + 1);
        content = content.substring(content.indexOf('>') + 1);
        content = content.substring(0, content.indexOf('</style>'));
      }
      content = wrapCss(`[${cssId}]`, content, encapsulate);
      return styleTag ? `${styleTag}${content}</style>` : content;
    }
    // cssId already outputted for this page
    return '';
  });
}

function addPage(args) {
  return new Promise((resolve, reject) => {
    const pageTemplatesPath = path.join('./templates', contentFolder, '/');
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
      let sectionFolder = path.join(sourceFolder, contentFolder);
      if (args.section) {
        args.section = args.section.toLowerCase();
        sectionFolder = path.join(sectionFolder, args.section);
      }
      const frontMatter = args.frontMatter && '\n' + args.frontMatter.join('\n') + '\n';
      const date = new moment().format('yyyy-MM-DD hh:mm:ss');
      let pageTemplate = fs.readFileSync(componentTemplate).toString('utf8');
      const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'), {
        tags: {
          blockStart: '<%',
          blockEnd: '%>',
          variableStart: '<$',
          variableEnd: '$>',
          commentStart: '<#',
          commentEnd: '#>'
        }
      });
      pageTemplate = env.renderString(pageTemplate, {
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
              ]}).then(resolve).catch(reject);
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      } else {
        const errorMessage = `"${args.name}" already exists.`;
        console.error(
          chalk.red.bold(errorMessage)
        );
        reject(new Error(errorMessage));
      }
    } else {
      const errorMessage = 'Invalid page template: ' + componentTemplate;
      console.error(
        chalk.red.bold(errorMessage)
      );
      reject(new Error(errorMessage));
    }
  });
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
    forceRebuild();
  }
}

module.exports = {
  startWatcher, configure, getZuixConfig, addPage, wipeContent
}
