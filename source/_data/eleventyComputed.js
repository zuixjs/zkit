module.exports = {
  eleventyComputed: {
    _data: (data) => {
      const d = Object.assign({}, data);
      delete d.collections;
      delete d.eleventyComputed;
      delete d.pkg;
      return d;
    }
  }
};
