module.exports = (collections, page) => {
  let collection = collections[`posts_blog`]; // default collection
  const path = page.url.split('/');
  if (path.length > 2) {
    const section = 'posts_' + path[path.length - 3];
    if (collections[section]) {
      collection = collections[section];
    }
  }
  return collection;
};
