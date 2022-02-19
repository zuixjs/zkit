zuix.controller(function(cp) {
  cp.init = function() {
    zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css');
    zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css');
  };
  cp.create = function() {
    const parsedHtml = zuix.$.replaceBraces(cp.view().html(), function(varName) {
      switch (varName) {
        case 'url':
          return encodeURIComponent(cp.model()[varName].href);
        case 'description':
          return encodeURIComponent(cp.model()[varName].innerHTML);
      }
    });
    if (parsedHtml != null) cp.view().html(parsedHtml);
  };
});
