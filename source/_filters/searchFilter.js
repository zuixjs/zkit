const Fuse = require('fuse.js');
const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

module.exports = function(collection) {
  const baseUrl = this.ctx.app.baseUrl;
  const pages = collection.map(function(page) {
    const data = {content: page.template.frontMatter.content};
    const content = nunjucks
        .renderString('{{ content | striptags }}', data)
        .substring(0, 600);
    let image = page.template.frontMatter.data.coverPreview;
    if (image && image.startsWith('./')) {
      image = path.join(page.url, page.template.frontMatter.data.coverPreview);
    }
    if (image && image.startsWith('/')) {
      image = path.join(baseUrl, image);
    }
    return {
      url: path.join(baseUrl, page.url),
      date: page.template.frontMatter.data.pubDate,
      title: page.template.frontMatter.data.title,
      description: page.template.frontMatter.data.description,
      image,
      content
    };
  });
  fs.writeFileSync(this.ctx.page.outputPath.replace('-index.', '-list.'), JSON.stringify(pages));
  return Fuse.createIndex(['title', 'description', 'content'], pages).toJSON();
};
