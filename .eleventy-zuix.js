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
const pkg = require('./package.json');

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
const capcon = require('capture-console');

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
  const templateExtensions = ['.html', '.js', '.css', '.less', '.scss', '.njk'];
  const templateFolders = componentsFolders.map(f =>  path.resolve(path.join(sourceFolder, f)));
  const copyFilesWatcher = chokidar.watch(watchFiles).on('all', (event, file, stats) => {
    if (watchEvents[event] && fs.existsSync(file) && file.indexOf('/_inc/') === -1) {
      const outputFile = path.resolve(path.join(buildFolder, file.substring(path.resolve(sourceFolder).length)));
      const outputFolder = path.dirname(outputFile);
      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
      }
      const postProcess = templateExtensions.filter(cn => file.endsWith(cn));
      if (postProcess.length === 1) {
        // Post-process file with Nunjucks
        const njk = new nunjucks.Environment(new nunjucks.FileSystemLoader([
          path.dirname(file),
          ...templateFolders
        ], {}));
        njk.render(file, { pkg, app: zuixConfig.app }, function(err, res) {
          if (err != null) {
            console.error(
              chalk.red.bold(err)
            );
          } else {
            fs.writeFile(outputFile, res, function() {
              // TODO: ...
            });
          }
        });
      } else {
        // Do not post-process, copy as-is
        fs.copyFileSync(file, outputFile);
      }
    } else {
      // TODO: maybe remove file from output folder as well if it was unlinked?
      // TODO: >> recompile dependant files if the modified file is inside an `_inc` folder
    }
    if (browserSync) {
      browserSync.reload();
    }
  });
  const includes = path.join(sourceFolder, includesFolder);
  const allFilesWatcher = chokidar.watch([sourceFolder]).on('all', (event, file, stats) => {
    if (event.startsWith('unlink')) {
      forceRebuild(200);
    } else if (!file.startsWith(includes) && file.indexOf(path.join('/', '_inc', '/')) !== -1) {
      forceRebuild(200);
    }
  });
  setupSocketApi(browserSync);
}

function setupSocketApi(browserSync) {
  // zuix-browser-sync WebSocket API
  if (browserSync && !io) {
    io = browserSync.instance.io;
    io.on('connection', (socket) => {
      socket.on('zuix:loadContent', (request) => {
        cmsLog('zuix:loadContent', request.path);
        fs.readFile(request.path, (err, content) => {
          if (!err) {
            request.content = content.toString('utf8');
            ioEmit('zuix:loadContent:done', request);
          } else {
            ioEmit('zuix:loadContent:error', err.message);
          }
        });
      });
      socket.on('zuix:saveContent', (request) => {
        cmsLog('zuix:saveContent', request.path);
        fs.writeFile(request.path, request.content, () => {
          ioEmit('zuix:saveContent:done', {path: request.path});
          forceRebuild(2000); // <--- TODO: this is a patch to the fact sometimes 11ty doesn't rebuild
        });
      });
      socket.on('zuix:addPage', (data) => {
        cmsLog('zuix:addPage', data);
        addPage(data).then(() => {
          const redirectUrl = zuixConfig.app.baseUrl + contentFolder + '/' + data.section + '/';
          ioEmit('zuix:addPage:done', redirectUrl);
          forceRebuild(2000); // <--- TODO: this is a patch to the fact sometimes 11ty doesn't rebuild
        }).catch((err) => {
          ioEmit('zuix:addPage:error', err.message);
        });
      });
      socket.on('zuix:deletePage', (data) => {
        cmsLog('zuix:deletePage', data.page.outputPath, path.resolve(data.page.url, '..'));
        try {
          if (data.page.filePathStem.endsWith('/index')) {
            // delete folder too
            fs.rmSync(path.resolve(data.page.inputPath, '..'), { recursive: true, force: true });
            fs.rmSync(path.resolve(data.page.outputPath, '..'), { recursive: true, force: true });
          } else {
            // delete single file
            fs.rmSync(data.page.inputPath);
          }
          const redirectUrl = path.resolve(data.page.url, '..');
          ioEmit('zuix:deletePage:done', redirectUrl);
          forceRebuild();
        } catch (e) {
          ioEmit('zuix:deletePage:error', e);
        }
      });
      socket.on('zuix:addComponent', (data) => {
        browserSync.notify('Adding component...');
        const handlePromise = (promise) => {
          promise.then((res) =>  {
            generateTemplate(res);
            ioEmit('zuix:addComponent:done', res);
          })
            .catch((err) => {
              ioEmit('zuix:addComponent:error', err.message);
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
      socket.on('zuix:buildAll', (request) => {
        cmsLog('zuix:buildAll');
        forceRebuild(200);
      });
    });
    // Errors notifying
    let errorObject = {
      errors: [],
      message: '',
      debug: false
    }
    // Eleventy console messages handling
    let errorNotifierTimeout = null;
    const errorNotifier = function() {
      if (!errorObject.errors[0].startsWith('! ') && !errorObject.errors[0].startsWith(' Benchmark ')) {
        ioEmit('zuix:eleventy:error', errorObject);
      }
      errorObject.errors = [];
      errorObject.message = '';
      errorObject.debug = false;
    }
    // Capture console output to notify errors
    capcon.startCapture(process.stderr, {}, function (stderr) {
      if (stderr && stderr.replace) {
        stderr = stderr
            .replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
            .replace(/ *\([^)]*\) */g, '').replace(/ +$/, '');
        if (stderr.indexOf('\n[11ty] ') !== -1) {
          errorObject.debug = true;
        } else if (stderr.startsWith('[11ty]')) {
          stderr = stderr.substring(6).replace(/ +$/, '');
        }
        errorObject.errors.push(stderr);
        if (!errorObject.debug) {
          errorObject.message += stderr;
        }
        clearTimeout(errorNotifierTimeout);
        errorNotifierTimeout = setTimeout(errorNotifier, 250);
      }
    });
  }
}
function ioEmit(message, data) {
  io.emit(message, data);
  // log emitted data
  let info = data ? ` (${JSON.stringify(data)})` : '';
  if (data && data.page) {
    info = ` (${data.page.outputPath} ${path.resolve(data.page.url, '..')})`;
  } else if (data && data.path) {
    info = ` (${data.path})`;
  }
  cmsLog(`${message}${info}`);
}
function cmsLog(...args) {
  console.log(`[zuix-cms] ${args.join(' ')}`);
}

let forceRebuildTimeout = null;
function forceRebuild(delay) {
  clearTimeout(forceRebuildTimeout);
  forceRebuildTimeout = setTimeout(() => {
    touch('.eleventy.js');
  }, delay);
}
function touch(filename) {
  const time = new Date();
  try {
    fs.utimesSync(filename, time, time);
  } catch (err) {
    fs.closeSync(fs.openSync(filename, 'w'));
  }
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
    clearTimeout(forceRebuildTimeout);
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
    if (io) {
      ioEmit('zuix:build:done');
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
      postProcessRecursiveSync(f, buildFolder)
    });
  }
  eleventyConfig.setDataDeepMerge(true);
}

function postProcessRecursiveSync( source, target ) {
  let files = [];
  // Check if folder needs to be created or integrated
  const targetFolder = path.join( target, path.basename( source ) );
  if ( !fs.existsSync( targetFolder ) ) {
    fs.mkdirSync( targetFolder );
  }
  // Copy
  if ( fs.lstatSync( source ).isDirectory() ) {
    files = fs.readdirSync( source );
    files.forEach( function ( file ) {
      const curSource = path.join( source, file );
      if ( fs.lstatSync( curSource ).isDirectory() ) {
        postProcessRecursiveSync( curSource, targetFolder );
      } else {
        const templateExtensions = ['.html', '.js', '.css', '.less', '.scss', '.njk'];
        const templateFolders = componentsFolders.map(f =>  path.resolve(path.join(sourceFolder, f)));
        const postProcess = templateExtensions.filter(cn => curSource.endsWith(cn));
        const outputFile = path.resolve(path.join(buildFolder, curSource.substring(sourceFolder.length)));
        if (postProcess.length === 1) {
          // Post-process file with Nunjucks
          const njk = new nunjucks.Environment(new nunjucks.FileSystemLoader([
            path.dirname(curSource),
            ...templateFolders
          ], {}));
          njk.render(path.resolve(curSource), {pkg, app: zuixConfig.app}, function(err, res) {
            if (err != null) {
              console.error(
                chalk.red.bold(err)
              );
            } else {
              // fs.readFileSync(curSource)
              fs.writeFile(outputFile, res, function() {
                // TODO: ...
              });
            }
          });
        } else {
          fs.writeFileSync(outputFile, fs.readFileSync(curSource));
        }
      }
    });
  }
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
        fs.writeFile(outputFile, pageTemplate, () => {
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
//              forceRebuild(3000);
              resolve();
            }
          } else {
            resolve();
          }
        });
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
