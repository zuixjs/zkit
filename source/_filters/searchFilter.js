const Fuse = require('fuse.js');
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

module.exports = function(collection) {
  const baseUrl = this.ctx.app?.baseUrl || '';
  const pages = collection.filter((page) => page.url !== false).map((page) => {
    let contentForProcessing = '';
    if (page.data && typeof page.data.description === 'string') {
      contentForProcessing = page.data.description;
    } else if (page.data && typeof page.data.content === 'string') {
      contentForProcessing = page.data.content;
    }
    const strippedContent = nunjucks
        .renderString('{{ content | striptags | truncate(600, true, "") }}', {content: contentForProcessing});

    let image = page.data.coverPreview;
    if (image && image.startsWith('./')) {
      let pageDir = page.url;
      if (pageDir === false) pageDir = '/';
      if (pageDir && !pageDir.endsWith('/')) {
        pageDir = path.dirname(pageDir);
        if (pageDir === '.') pageDir = '/';
        pageDir = pageDir + '/';
      }
      image = pageDir + image.substring(2);
    }
    if (image && image.startsWith('/') && (!image.startsWith(baseUrl) && baseUrl)) {
      image = baseUrl + image;
    }

    return {
      url: page.url.startsWith(baseUrl) ? page.url : baseUrl + (page.url === '/' && baseUrl.endsWith('/') ? '' : page.url),
      date: page.data.pubDate,
      title: page.data.title,
      description: page.data.description,
      image,
      content: strippedContent
    };
  });

  let listFilePath;
  if (this.page && this.page.outputPath) {
    listFilePath = this.page.outputPath.replace('-index.', '-list.');
  } else {
    const outputDirRoot = (this.eleventy && this.eleventy.directories && this.eleventy.directories.output) ? this.eleventy.directories.output : '_site';
    listFilePath = path.join(outputDirRoot, 'search-list.json');
    console.warn(`[searchFilter] this.page.outputPath not available. Defaulting to: ${listFilePath}`);
  }

  const outputDir = path.dirname(listFilePath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true});
  }
  fs.writeFileSync(listFilePath, JSON.stringify(pages));

  return Fuse.createIndex(['title', 'description', 'content'], pages).toJSON();
};
