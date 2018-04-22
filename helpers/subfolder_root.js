// static-site module helper
module.exports = function (site, cb) {
    site = site.map(function(page) {
        page.root = page.root.substring(3);
        if (page.root.length > 0)
            page.root += '/';
        return page;
    });
    cb(null, site);
};
