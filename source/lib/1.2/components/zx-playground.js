const _paths = {
  monacoEditor: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0-dev.20230511/min/',
  defaultComponentId: 'https://zuixjs.org/app/examples/new-component'
};

import('{{ app.zkit.libraryPath }}controllers/mdl-button.module.js');
import('{{ app.zkit.libraryPath }}controllers/mdl-menu.module.js');

class ZxPlayground extends ControllerInstance {
  // maybe switch `_` to private field `#`
  _extraLib = null;
  _errorCheckTimeout = null;
  _updateTimeout = null;
  _isLoading = false;

  _editorHtml = null;
  _editorCss = null;
  _editorJs = null;

  componentId = _paths.defaultComponentId;
  componentData = {
    html: '',
    css: '',
    js: ''
  };
  componentContext = null;

  // listen to URL hash changes
  _hashChangeListener = () => {
    const locationHash = window.location.hash.substring(1);
    const cid = locationHash || this.componentId;
    if (cid !== this.componentId) {
      this.componentId = cid;
      this.loadWidgetFiles(cid, () => {
        // TODO: ..
      });
    }
  };

  // ControllerInstance life-cycle methods: onInit / onCreate / onDispose

  onInit() {

    // set components library path used in the view template
    zuix.store('config')
        .libraryPath['@lib[1.2]'] = '{{ app.zkit.libraryPath }}';

    this.waitingResources = 2;

    // override the default "ready" handler in order to wait for
    // dependencies to be loaded before starting the component
    this.declare('ready', () => this.waitingResources === 0);

    // Before starting, this component will
    // wait until the following module is loaded
    import('https://zuixjs.github.io/zkit/js/zuix/zx-context.module.js')
        .then(() => this.waitingResources--);

    // Load Monaco Editor from CDNJS
    zuix.using('script', _paths.monacoEditor + 'vs/loader.min.js', () => {
      this.createEditors(() => this.waitingResources--);
    });

    // get component id from location hash (if any) or via the `load` option
    this.componentId = window.location.hash.substring(1) ||
      this.options().load ||
      this.componentId;
    console.log(this.options(), this);

  }

  onCreate() {

    // add custom menu items
    this.buildMenuList(this.options().menuItems || []);

    // Tab buttons cursor implementation
    const tabCursor = this.field('tabCursor');
    this.moveCursorTo = (target) => {
      const targetPosition = zuix.$(target).position();
      tabCursor
          .css({
            left: (targetPosition.x - this.view().position().x - 1) + 'px',
            width: targetPosition.rect.width + 'px'
          });
    };

    let selectedTab = null;
    const dialog = this.field('nameRequestDialog');
    // declare properties/methods that can be used in the view template
    const viewDeclarations = {
      getSelected: () => selectedTab,
      setSelected: (el) => selectedTab = el,
      switchEditor: (el, $editor) => {
        selectedTab = el;
        this.view('.editor-container')
            .hide();
        $editor.show();
        this.moveCursorTo(selectedTab);
      },
      editNew: () => {
        this.loadWidgetFiles(this.componentId, () => {
          // TODO: ...
        });
      },
      load: (e) => {
        this.loadWidgetFiles(e.detail, () => {
          // TODO: ...
        });
      },
      download: () => {
        dialog.one('close', (e) => {
          const name = dialog.get().returnValue;
          if (name.length) {
            this.downloadComponent(name);
          }
        }).get().showModal();
      },
      isLoading: () => this._isLoading
    };
    this.declare(viewDeclarations);

    // wait the "monaco:loaded" event before then set the current tab
    this.view().one('monaco:loaded', () => {
      setTimeout(() => this.moveCursorTo(this.field('editViewButton').get()), 50);
      self.addEventListener(
          'hashchange',
          this._hashChangeListener,
          false
      );
    });

  }

  onDispose() {
    clearTimeout(this._errorCheckTimeout);
    if (this._extraLib) {
      this._extraLib.dispose();
    }
    self.removeEventListener('hashchange', this._hashChangeListener);
  }

  // Other utility methods

  buildMenuList(list) {
    const templateElement = this.field('item-template');
    const templateHtml = templateElement.html();
    let listHtml = '';
    list.forEach((item) => {
      listHtml += zuix.$.replaceBraces(templateHtml, (key) => {
        switch (key) {
          case '{link}':
            return item.link.startsWith('#') ? item.link : '#' + item.link;
          case '{description}':
            return item.description;
        }
      });
    });
    templateElement.get().outerHTML = listHtml;
  }

  loadWidgetFiles(componentId, callback) {
    const m = this.model();
    const download = (type, downloadCallback) => fetch(`${componentId}.${type}`, {
      mode: 'cors'
    }).then((res) => {
      if (res.status === 200) {
        res.text().then((text) => downloadCallback(text));
      } else {
        downloadCallback('');
        console.log('ERROR', res);
      }
    }).catch((err) => {
      downloadCallback('');
      console.log('ERROR', err);
    });
    this._isLoading = true;
    m.componentId = `${componentId}.html`;
    download('html', (html) => {
      m.componentId = `${componentId}.css`;
      download('css', (css) => {
        m.componentId = `${componentId}.js`;
        download('js', (js) => {
          this._editorHtml.setValue(html);
          this._editorCss.setValue(css);
          this._editorJs.setValue(js);
          this.componentData = {html, css, js};
          callback(this.componentData);
          this._isLoading = false;
        });
      });
    });
  }

  createEditors(callback) {
    const htmlEditor = this.field('html-editor').show();
    const cssEditor = this.field('css-editor').hide();
    const jsEditor = this.field('js-editor').hide();

    require.config({paths: {vs: _paths.monacoEditor + 'vs'}});

    // Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
    // the default worker url location (used when creating WebWorkers). The problem here is that
    // HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
    // a web worker through a same-domain script
    window.MonacoEnvironment = {
      getWorkerUrl: function(workerId, label) {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: '${_paths.monacoEditor}'
        };
        importScripts('${_paths.monacoEditor}vs/base/worker/workerMain.js');`
        )}`;
      }
    };

    require(['vs/editor/editor.main'], () => {
      // create editor instances
      this._editorHtml = monaco.editor.create(htmlEditor.get(), {
        value: '',
        language: 'html',
        automaticLayout: true,
        theme: 'vs-dark'
      });
      this._editorCss = monaco.editor.create(cssEditor.get(), {
        value: '',
        language: 'css',
        automaticLayout: true,
        theme: 'vs-dark'
      });
      this._editorJs = monaco.editor.create(jsEditor.get(), {
        value: '',
        language: 'javascript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.view().one('monaco:loaded', () => {
        // set event listeners
        this._editorHtml.getModel().onDidChangeContent((event) => {
          this.componentData.html = this._editorHtml.getValue();
          this.updateWidget();
        });
        this._editorCss.getModel().onDidChangeContent((event) => {
          this.componentData.css = this._editorCss.getValue();
          this.componentContext.style(this.componentData.css);
        });
        this._editorJs.getModel().onDidChangeContent((event) => {
          this.componentData.js = this._editorJs.getValue();
          this.updateWidget();
        });

        if (this.componentData.html || this.componentData.css || this.componentData.js) {
          this.updateWidget();
        } else {
          // TODO: most likely an error occurred loading component's parts
        }
      });

      fetch('{{ app.zkit.libraryPath }}components/zx-playground/zuix.d.ts').then((res) => {
        res.text().then((tsd) => {
          const additionalDeclarations =
              'declare const info: any;'; // <-- TODO: just a test, to be used to declare component's context variables/members
          this._extraLib = monaco.languages.typescript.javascriptDefaults.addExtraLib(
              `${tsd}\n${additionalDeclarations}`,
              'file:///components/zx-playground/zuix.d.ts'
          );

          this.loadWidgetFiles(this.componentId, (mvc) => {
            this.componentData = mvc;
            // signal the 'loaded' event
            this.trigger('monaco:loaded');
            if (callback) callback();
          });
        });
      });

      // make Monaco recognize "jscript" as "javascript" alias
      monaco.languages.getLanguages().find((lang) => lang.id === 'html').loader().then(
          (lang) => {
            const tokenizer = lang.language.tokenizer;
            tokenizer.scriptAfterTypeEquals.unshift([
              /'jscript'/, {token: 'attribute.value', switchTo: '@scriptWithCustomType.text/javascript'}
            ]);
            tokenizer.scriptAfterTypeEquals.unshift([
              /"jscript"/, {token: 'attribute.value', switchTo: '@scriptWithCustomType.text/javascript'}
            ]);
          }
      );
    });
  }

  updateWidget() {
    clearTimeout(this._updateTimeout);
    this._updateTimeout = setTimeout(() => this._updateWidget(), 50);
  }
  _updateWidget() {
    const {html, css, js} = this.componentData;
    const widgetView = this.field('widget');
    const zxWidget = widgetView.get();

    let controller = '';
    try {
      let error = false;
      this.hideErrors();
      controller = zuix.controller(`${js || 'class NoOp extends ControllerInstance {}'}`, {
        error: (e) => {
          // notify error via UI
          error = e.message.match(/^.*$/m)[0];
          this.showErrors(error);
        },
        componentId: this.componentId
      });
      if (!error) {
        zxWidget.load(this.componentId, {
          html: html.length ? html : ' ',
          css,
          controller,
          ready: (ctx) => {
            this.componentContext = ctx;
            this.clearError();
          },
          error: (err) => this.setError(err)
        });
      }
    } catch (e) {
      this.showErrors(e.message);
    }
  }

  checkErrors() {
    clearTimeout(this._errorCheckTimeout);
    this._errorCheckTimeout = setTimeout(() => {
      const model = this._editorJs.getModel();
      this.jsCodeErrors = monaco.editor.getModelMarkers({owner: 'javascript'})
          .concat(monaco.editor.getModelMarkers({owner: 'service'}))
          .filter((e) => e.severity === monaco.MarkerSeverity.Error);
      if (this.jsCodeErrors.length) {
        let errorsMessage = '';
        this.jsCodeErrors.forEach((err) => {
          if (err.startLineNumber <= model.getLineCount()) {
            errorsMessage += `<strong>[JS] (${err.startLineNumber};${err.startColumn}-${err.endLineNumber};${err.endColumn})</strong>: ${err.message}\n`;
          } else {
            errorsMessage += `<strong>[HTML]</strong>: ${err.message}\n`;
          }
        });
        this.showErrors(errorsMessage);
      } else {
        this.hideErrors();
      }
    }, 1000);
  }
  setError(err) {
    zuix.using('script', 'https://cdn.jsdelivr.net/npm/error-stack-parser@2.1.4/dist/error-stack-parser.min.js', () => {
      const frames = self.ErrorStackParser.parse(err);
      const errorFrame = frames[0]; // <-- TODO: find by 'fileName'
      errorFrame.lineNumber -= 2; // adjust source line
      // set error
      const error = {
        startLineNumber: errorFrame.lineNumber,
        startColumn: errorFrame.columnNumber,
        endLineNumber: errorFrame.lineNumber,
        endColumn: errorFrame.columnNumber,
        message: err.message,
        severity: monaco.MarkerSeverity.Error
      };
      const model = this._editorJs.getModel();
      monaco.editor.setModelMarkers(model, 'service', [error]);

      // check for other errors (view)
      this.checkErrors();
    });
  }

  showErrors(errorsMessage) {
    this.field('errors-log')
        .html(errorsMessage).parent().show('block');
  }
  hideErrors() {
    this.field('errors-log')
        .html('').parent().hide();
  }
  clearError() {
    const model = this._editorJs.getModel();
    monaco.editor.setModelMarkers(model, 'service', []);
    this.hideErrors();
    this.checkErrors();
  }

  downloadComponent(componentName = 'component-name') {
    zuix.using('script', '@cdnjs/jszip/3.10.1/jszip.min.js', () => {
      const zip = new JSZip();
      zip.file(`${componentName}.html`, this.componentData.html);
      zip.file(`${componentName}.css`, this.componentData.css);
      zip.file(`${componentName}.js`, this.componentData.js);
      zip.file(`${componentName}.module.js`, `const setup = () => {
  // change 'componentId' value if component
  // location is other than the default one ("/app/")
  const componentId = '${componentName}';
  customElements.define('${componentName}', class extends HTMLElement {
    context = null;
    connectedCallback() {
      if (this.context === null) {
        this.context = false;
        zuix.loadComponent(this, componentId, undefined, {
          container: this.attachShadow({mode: 'closed'}),
          ready: (ctx) => this.context = ctx
        });
      }
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();`);
      zip.file(`README.md`, `# How to use this component

- Copy the component files to the **/app/** folder of your website/application.
- Add the component's module to your page:
\`\`\`html
<script src="/app/${componentName}.module.js" type="module"></script>
\`\`\`
- Use the component in your page:
\`\`\`html
<${componentName}></${componentName}>
\`\`\`
- If you want to place the component in a location other than **/app/**, ensure to update
  the component's path in the \`${componentName}.module.js\` file by changing the value
  of the \`const componentId\` accordingly. 

This component was auto-generated from [zuix.js playground](https://zuixjs.org/playground/)
on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}.
`);
      zip.generateAsync({type: 'blob'})
          .then(function(content) {
            zuix.using('script', 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix-bundler.min.js', () => {
              zuix.saveBlob(content, `${componentName}.zip`);
            });
          });
    });
  }
}
