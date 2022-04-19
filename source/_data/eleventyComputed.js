module.exports = {
  eleventyComputed: {
    _data: (data) => {
      let d = JSON.stringify(data);
      d = JSON.parse(d);
      delete d.collections;
      delete d.eleventyComputed;
      delete d.pkg;
      return d;
    }
  }
};
