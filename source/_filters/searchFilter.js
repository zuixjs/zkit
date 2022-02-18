// from: https://www.belter.io/eleventy-search/
const elasticlunr = require('elasticlunr');

module.exports = function(collection) {
  // what fields we'd like our index to consist of
  const index = elasticlunr(function() {
    this.addField('title');
    this.addField('description');
    this.addField('keywords');
    this.setRef('id');
  });
  // loop through each page and add it to the index
  collection.forEach((page) => {
    index.addDoc({
      id: page.url,
      title: page.template.frontMatter.data.title,
      description: page.template.frontMatter.data.description,
      keywords: page.template.frontMatter.data.keywords
    });
  });
  return index.toJSON();
};
