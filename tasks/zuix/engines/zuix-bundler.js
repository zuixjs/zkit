/*
 * Copyright 2017-2018 G-Labs. All Rights Reserved.
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

// common
const fs = require('fs');
const path = require('path');
const util = require('util');
const request = require('sync-request');
const stringify = require('json-stringify');
// Markdown
const showdown = require('showdown');
const markdown = new showdown.Converter();
// logging
const tlog = require('../lib/logger');
// ESLint
const linter = require("eslint").linter;
const lintConfig = require(process.cwd()+'/.eslintrc');
// LESS
const less = require('less');
const lessConfig = require(process.cwd()+'/.lessrc');
// config
const config = require('config');
const zuixConfig = config.get('zuix');
// zuix-bundler cli
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const LIBRARY_PATH_DEFAULT = 'https://genielabs.github.io/zkit/lib';

const zuixBundle = {
    viewList: [],
    styleList: [],
    controllerList: []
};
let stats, hasErrors;

function createBundle(sourceFolder, data) {
    if (data.file.endsWith('.html')) {
        const dom = new JSDOM(data.content);
        const nodeList = dom.window.document.querySelectorAll('[data-ui-include],[data-ui-load]');
        if (nodeList != null) {
            nodeList.forEach(function(el) {
                let skipElement = false;
                let parent = el.parentNode;
                while (parent != null) {
                    if (parent.tagName == 'PRE')
                    {
                        skipElement = true;
                        break;
                    }
                    parent = parent.parentNode;
                }
                if (skipElement) {
                    return;
                }
                let hasJsFile = false;
                let path = el.getAttribute('data-ui-include');
                if (path == null || path === '') {
                    path = el.getAttribute('data-ui-load');
                    hasJsFile = true;
                }
                if (dom.window.document.querySelectorAll('[data-ui-view="'+path+'"]').length > 0)  {
                    return;
                }
                let content;
                if (hasJsFile) {
                    if (isBundled(zuixBundle.controllerList, path)) {
                        return;
                    }
                    content = fetchResource('js', path, sourceFolder, true);
                    if (content != null) {
                        zuixBundle.controllerList.push({path: path, content: content});
                    }
                }
                // HTML
                if (isBundled(zuixBundle.viewList, path)) {
                    return;
                }
                content = fetchResource('html', path, sourceFolder, !hasJsFile);
                if (content != null) {
                    const md = el.getAttribute('data-o-markdown');
                    if (md != null && md.trim() === 'true') {
                        content = render(content);
                    }
                    if (el.getAttribute('data-ui-mode') === 'unwrap') {
                        // TODO: add HTML comment with file info
                        el.outerHTML = content;
                    } else {
                        createBundle(sourceFolder, {
                            file: sourceFolder + '/' + zuixConfig.app.resourcePath + '/' + path + '.html',
                            content: content
                        });
                        zuixBundle.viewList.push({path: path, content: content});
                    }
                }
                // CSS
                content = fetchResource('css', path, sourceFolder);
                if (content != null) {
                    if (el.getAttribute('data-ui-mode') === 'unwrap') {
                        // TODO: add // comment with file info
                        content = util.format('\n<style id="%s">\n%s\n</style>\n', path, content);
                        dom.window.document.querySelector('head').innerHTML += util.format('\n<!--{[%s]}-->\n%s', path, content);
                    } else {
                        zuixBundle.styleList.push({path: path, content: content});
                    }
                }
            });
        }
        return dom;
    }
}

function isBundled(list, path) {
    const AlreadyExistsException = {};
    try {
        list.forEach(function(b) {
            if (b.path === path) {
                throw AlreadyExistsException;
            }
        });
    } catch (e) {
        if (e === AlreadyExistsException) {
            return true;
        }
    }
    return false;
}

function fetchResource(type, path, sourceFolder, reportError) {
    let content = null;
    let isLibraryPath = false;
    if (path.startsWith('@lib/')) {
        // resolve components library path
        if (zuixConfig.app.libraryPath != null) {
            if (zuixConfig.app.libraryPath.indexOf('://') > 0 || zuixConfig.app.libraryPath.startsWith('//')) {
                path = zuixConfig.app.libraryPath + path.substring(4);
            } else {
                path = sourceFolder + '/' + zuixConfig.app.libraryPath + path.substring(4);
            }
        } else {
            path = LIBRARY_PATH_DEFAULT + path.substring(4);
        }
        isLibraryPath = true;
    }
    // add file type extension
    path = path + '.' + type;
    const error = '   ^#^R^W[%s]^:';
    if (path.indexOf('://') > 0 || path.startsWith('//')) {
        if (path.startsWith('//')) {
            path = 'https:'+path;
        }
        tlog.overwrite('   ^C%s^: downloading "%s"', tlog.busyCursor(), path);
        const res = request('GET', path);
        if (res.statusCode === 200) {
            content = res.getBody('utf8');
            tlog.overwrite('');
        } else if (reportError) {
            hasErrors = true;
            tlog.term.previousLine();
            tlog.error(error+' %s', res.statusCode, path)
                .br();
        }
    } else {
        const f = isLibraryPath ? path : sourceFolder + '/' + zuixConfig.app.resourcePath + '/' + path;
        tlog.overwrite('   ^C%s^: reading "%s"', tlog.busyCursor(), path);
        try {
            content = fs.readFileSync(f).toString();
            tlog.overwrite('');
        } catch (e) {
            if (reportError) {
                hasErrors = true;
                tlog.term.previousLine();
                tlog.error(error+' %s', e.code, f)
                    .br();
            }
        }
    }
    return content;
}

function getBundleItem(bundle, path) {
    let item = null;
    const AlreadyExistsException = {};
    try {
        bundle.forEach(function(b) {
            if (b.componentId === path) {
                item = b;
                throw AlreadyExistsException;
            }
        });
    } catch (e) {
        if (e === AlreadyExistsException) {
            return item;
        }
    }
    item = {
        componentId: path
    };
    bundle.push(item);
    return item;
}

function generateApp(sourceFolder, data) {
    const dom = createBundle(sourceFolder, data);
    if (dom != null) {
        let inlineViews = '<!-- zUIx inline resource resourceBundle -->';
        zuixBundle.viewList.forEach(function(v) {
            const content = util.format('<div data-ui-view="%s">\n%s\n</div>', v.path, v.content);
            inlineViews += util.format('\n<!--{[%s]}-->\n%s', v.path, content);
            stats[v.path] = stats[v.path] || {};
            stats[v.path].view = true;
        });
        let resourceBundle = [];
        zuixBundle.controllerList.forEach(function(s) {
            // TODO: ensure it ends with ';'
            getBundleItem(resourceBundle, s.path).controller = s.content;
            stats[s.path] = stats[s.path] || {};
            stats[s.path].controller = true;
        });
        zuixBundle.styleList.forEach(function(s) {
            getBundleItem(resourceBundle, s.path).css = s.content;
            stats[s.path] = stats[s.path] || {};
            stats[s.path].css = true;
        });
        const json = stringify(resourceBundle, null, 2);
        let jsonBundle = '\n    <script>zuix.bundle('+json+')</script>\n';

        // add style to hide inline views
        dom.window.document.querySelector('head').innerHTML += '    <style>[data-ui-view] { display: none; }</style>\n';
        // add inline views
        dom.window.document.body.innerHTML += inlineViews;
        // add bundle
        dom.window.document.body.innerHTML += jsonBundle;

        data.content = dom.serialize();
    }
}

module.exports = function(options, template, data, cb) {
    // reset globals for every page
    stats = {};
    hasErrors = false;
    // zUIx bundle
    tlog.br().info('^w%s^:', data.file);
    // Default static-site processing
    tlog.info(' ^r*^: static-site content');
    let html = swigTemplate(data)._result.contents;
    let isStaticSite = (html != data.content);
    if (isStaticSite) {
        data.content = html;
    }
    // Generate inline zUIx bundle
    tlog.overwrite(' ^r*^: zuix bundle');
    generateApp(options.source, data);
    if (Object.keys(stats).length > 0) {
        if (!hasErrors) {
            tlog.overwrite(' ^G\u2713^: zuix bundle');
        }
        // output stats
        for (const key in stats) {
            const s = stats[key];
            const ok = '^+^g';
            const ko = '^w';
            tlog.info('   ^w[^:%s^:%s^:%s^:^w]^: %s',
                s.view ? ok + 'v' : ko + '-',
                s.css ? ok + 's' : ko + '-',
                s.controller ? ok + 'c' : ko + '-',
                '^:' + key
            );
        }
    } else {
        // no zuix data processed ([data-ui-*] attributes)
        tlog.overwrite();
    }
    // Default static-site processing
    tlog.info(' ^r*^: static-site content');
    html = swigTemplate(data)._result.contents;
    if (html != data.content || isStaticSite) {
        data.content = html;
        tlog.overwrite(' ^G\u2713^: static-site content');
    } else {
        // no template data processed
        tlog.overwrite();
    }

    // run ESlint
    if (data.file.endsWith('.js')) {
        tlog.info(' ^r*^: lint');
        const issues = linter.verify(data.content, lintConfig, data.file);
        issues.forEach(function (m) {
            if (m.fatal || m.severity > 1) {
                tlog.error('   ^RError^: %s ^R(^Y%s^w:^Y%s^R)', m.message, m.line, m.column);
            } else {
                tlog.warn('   ^YWarning^: %s ^R(^Y%s^w:^Y%s^R)', m.message, m.line, m.column);
            }
        });
        if (issues.length === 0) {
            tlog.overwrite(' ^G\u2713^: lint');
        }
    }

    // run LESS
    if (data.file.endsWith('.less')) {
        tlog.info(' ^r*^: less');
        less.render(data.content, lessConfig, function(error, output) {
            const baseName = data.dest.substring(0, data.dest.length - 5);
            fs.writeFileSync(baseName+'.css', output.css);
            // TODO: source map generation disabled
            //fs.writeFileSync(baseName+'.css.map', output.map);
            tlog.overwrite(' ^G\u2713^: less');
        });
    }

    cb(null, data.content);
    tlog.info(' ^G\u2713^: done');
};


/* BEGIN 'static-site' default engine code */

const Promise = require('es6-promise').Promise;
const swig = require('swig-templates');
const isMarkdown = require(process.cwd()+'/node_modules/static-site/lib/utils/is-markdown');
const markdownTag = require(process.cwd()+'/node_modules/static-site/lib/utils/markdown-tag');
//const MarkdownIt = require('markdown-it');
//const hljs = require('highlight.js');
const extras = require('swig-extras');

/*
const markdown = MarkdownIt({
    html: true,
    langPrefix: '',
    highlight: function(code, lang) {
        const highlighted = lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code);
        return highlighted.value;
    }
});
*/

const filters = ['batch', 'groupby', 'nl2br', 'pluck', 'split', 'trim', 'truncate'];
filters.forEach(function(filter) {
    extras.useFilter(swig, filter);
});

function render(content) {
    return markdown.makeHtml(content);
    //return markdown.render(content);
}

swig.setTag('markdown', markdownTag.parse, markdownTag.compile, true, false);
swig.setExtension('markdown', render);
swig.setDefaults({cache: false});

extras.useTag(swig, 'switch');
extras.useTag(swig, 'case');

function swigTemplate(page) {
    let template = isMarkdown(page.file) ? markdown.render(page.content) : page.content;

    if (page.template) {
        const templatePath = path.join(this.sourcePath, page.template);
        const block = page.block || 'content';
        const wrapped = '{% block ' + block + '%}' + template + '{% endblock %}';
        template = '{% extends "' + templatePath + '" %}' + wrapped;
    }

    const html = swig.render(template, {
        filename: page.file,
        locals: page
    });

    return Promise.resolve({
        dest: page.dest,
        contents: html
    });
}

/* END 'static-site' default engine code */
