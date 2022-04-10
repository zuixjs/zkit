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
  wrapCss
} = require('zuix');

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
}).join('\n');

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
  copyDependencies();
  // zUIx.js specific code and life-cycle hooks
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
  eleventyConfig.on('beforeWatch', (cf) => {
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
  eleventyConfig.on('afterBuild', async function(args) {
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

function copyDependencies() {
  // Copy last zUIx release
  copyFolder(`${process.cwd()}/node_modules/zuix-dist/js`, `${buildFolder}/js/zuix`, (err) => {
    if (err) console.log(err);
  });
  // Auto-generated config.js
  generateAppConfig(zuixConfig);
  // Copy other dependencies
  // - elasticlurn search engine
  copyFolder(`${process.cwd()}/node_modules/elasticlunr/release`, `${buildFolder}/js/elasticlunr`, (err) => {
    if (err) console.log(err);
  });
  // - Flex Layout Attribute
  copyFolder(`${process.cwd()}/node_modules/flex-layout-attribute/css`, `${buildFolder}/css/fla`, (err) => {
    if (err) console.log(err);
  });
  // - Animate.CSS
  fs.copyFileSync(`${process.cwd()}/node_modules/animate.css/animate.min.css`, `${buildFolder}/css/animate.min.css`);
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
    const p = `./templates/tags/${template}.js`;
    if (fs.existsSync(p)) {
      delete require.cache[require.resolve(p)];
      return normalizeMarkup(require(p)(nunjucks.renderString, content, ...args));
    }
    return ''; // 'Not implemented! (' + content + ') [' + args + ']';
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

module.exports = {
  startWatcher, configure, getZuixConfig
}
