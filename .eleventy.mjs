/*
 * Copyright 2020-2025 G-Labs. All Rights Reserved.
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
 * @version 1.1
 *
 */

import path from 'path';
import compress from 'compression';

// 11ty
import { EleventyRenderPlugin } from "@11ty/eleventy";

// zuix.js
import zuix11ty from './.eleventy-zuix.js';
const zuixConfig = zuix11ty.getZuixConfig();

// LESS CSS compiler
import less from 'less';
import lessConfig from './.lessrc.json' assert { type: 'json' };

// Linter (ESLint)
import { Linter as ESLintLinter } from 'eslint';
const linter = new ESLintLinter();
import lintConfig from './.eslintrc.json' assert { type: 'json' };

export default function(eleventyConfig) {
  eleventyConfig.setWatchJavaScriptDependencies(false);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Add ignores
  [...zuixConfig.ignoreFiles, ...zuixConfig.componentsFolders].forEach((f) => {
    f = path.join(zuixConfig.sourceFolder, f);
    eleventyConfig.ignores.add(f);
  });
  // Ignore `zuix-editor` if mode is 'production'
  if (process.env.NODE_ENV === 'production') {
    eleventyConfig.ignores.add(path.join(zuixConfig.sourceFolder, 'editor/*'));
  }
  // Ignore "copy" files, because they are handled by zuix11ty
  zuixConfig.copyFiles.forEach((f) => {
    f = path.join(zuixConfig.sourceFolder, f);
    eleventyConfig.ignores.add(f);
  });

  // from https://github.com/kkgthb/web-site-11ty-03-netlify-function/blob/main/.eleventy.js
  // See if this helps with things that do not refresh
  //module.exports = function (eleventyConfig) {
  //  eleventyConfig.setUseGitIgnore(false);
  //};
  // Make Liquid capable of rendering "partials"
  eleventyConfig.setLiquidOptions({
    cache: false,
    dynamicPartials: true,
    strictFilters: false,
  });

  // Safe JSON pipe
  eleventyConfig.addFilter('jsonScriptSafe', function(value) {
    let jsonString;
    try {
      jsonString = JSON.stringify(value);
    } catch (e) {
      console.error('Error stringifying value in jsonScriptSafe filter:', e);
    }
    jsonString = jsonString.replace(/<\/(script)/gi, '<\\/$1');
    // Additional safe filters that could be applied:
    // jsonString = jsonString.replace(/<!--/g, '<\\!--');
    // jsonString = jsonString.replace(/]]>/g, ']]\\>');
    return jsonString;
  });

  // Add custom file types and handlers
  eleventyConfig.addTemplateFormats([ 'less', 'css', 'js' ]);
  eleventyConfig.addExtension('less', {
    read: true,
    outputFileExtension: 'css',
    compileOptions: {
      permalink: () => false
    },
    compile: async function(inputContent, inputPath) {
      try {
        const output = await less.render(inputContent, {
          ...lessConfig,
          filename: inputPath,
          paths: [path.dirname(inputPath), ...(lessConfig.paths || [])]
        });
        return output.css;
      } catch (error) {
        console.error(chalk.red(`LESS compilation error in ${inputPath}:\n`), error);
        return `/* LESS compilation error in ${inputPath}: \n${error.message}\nLine: ${error.line}, Column: ${error.column} */`;
      }
    }
  });
  // Add linter to report code errors
  eleventyConfig.addLinter('eslint', function(content, inputPath, outputPath) {
    if( inputPath.endsWith('.js') ) {
      // TODO: collect and report at the end of the build (inside 'afterBuild' event handler)
      const issues = linter.verify(content, lintConfig, inputPath);
      if (issues.length > 0) {
        console.log('[11ty] "%s" linter result', inputPath)
      }
      issues.forEach(function(m) {
        if (m.fatal || m.severity > 1) {
          console.error('       Error: %s (%s:%s)', m.message, m.line, m.column);
        } else {
          console.warn('       Warning: %s (%s:%s)', m.message, m.line, m.column);
        }
      });
    }
  });
  // Add any BrowserSync config option here
  eleventyConfig.setServerOptions({
    module: "@11ty/eleventy-server-browsersync",
    //reloadDelay: 2000,
    files: [ ...zuixConfig.componentsFolders ],
    notify: false,
    cors: true,
    middleware: [compress(), function(req, res, next) {
      res.setHeader('Set-Cookie', 'SameSite=Lax; Secure');
      next();
    }],
    callbacks: {
      ready: function(err, browserSync) {
        // setup zuix-11ty watcher
        zuix11ty.startWatcher(eleventyConfig, browserSync.publicInstance);
      }
    },
    /*
    snippet: false,
    snippetOptions: {
      rule: {
        match: /<head[^>]*>/i,
        fn: function(snippet, match) {
          return match + snippet;
        }
      }
    }*/
  });

  zuix11ty.configure(eleventyConfig);

  // Return 11ty configuration options:
  return {
    pathPrefix: zuixConfig.baseUrl,
    dir: {
      input: zuixConfig.sourceFolder,
      output: zuixConfig.buildFolder,
      data: zuixConfig.dataFolder,
      includes: zuixConfig.includesFolder,
      layouts: path.join(zuixConfig.includesFolder, "layouts")
    },
    //htmlTemplateEngine: false, // 'liquid'
    markdownTemplateEngine: 'liquid',
    templateFormats: ['html', 'liquid', 'ejs', 'md', 'hbs', 'mustache', 'haml', 'pug', 'njk', '11ty.js']
  }
};
