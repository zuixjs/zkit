const _paths = {
  componentsLibrary: 'https://zuixjs.github.io/zkit/lib/1.2/',
  monacoEditor: '@cdnjs/monaco-editor/0.38.0/min/vs/loader.min.js',
  defaultComponentId: 'https://zuixjs.org/app/examples/new-component'
};

let _zxContextLoaded = false;
// Before starting, this component will
// wait until the following module is loaded
// (see `ready` method override in the `viewDeclarations`)
import('https://zuixjs.github.io/zkit/js/zuix/zx-context.module.js')
    .then(() => _zxContextLoaded = true);
// No need to wait for this other module to be loaded since it just
// contains custom element declaration
import(`${_paths.componentsLibrary}controllers/mdl-button.module.js`);

let ErrorStackParser;

class ZxPlayground extends ControllerInstance {
  _monacoEditorLoaded = false;
  _extraLib = null;
  _errorCheckTimeout = null;
  _updateTimeout = null;
  _isLoading = false;

  editorHtml = null;
  editorCss = null;
  editorJs = null;

  componentId = _paths.defaultComponentId;
  componentData = {
    html: '',
    css: '',
    js: ''
  };
  componentContext = null;

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

  onInit() {
    self.zuixVersion = self.zuixVersion || '1.1.23';
    // set components library path used in the view template
    zuix.store('config')
        .libraryPath['@lib[1.2]'] = _paths.componentsLibrary;
    // get component id from location hash (if any)
    this.componentId = window.location.hash.substring(1) || this.componentId;
    // add custom menu items
    this.buildMenuList(this.options().menuItems || []);
  }

  // onCreate/onDispose -> ControllerInstance life-cycle methods
  onCreate() {
    // Tab buttons cursor implementation
    const tabCursor = this.field('tabCursor');
    const moveCursorTo = (target) => {
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
        moveCursorTo(selectedTab);
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
      // override the default "ready" handler in order to wait for
      // dependencies to be loaded before starting the component
      ready: () => this._monacoEditorLoaded && _zxContextLoaded,
      isLoading: () => this._isLoading
    };
    this.declare(viewDeclarations);

    // Load Monaco Editor from CDNJS
    zuix.using('script', _paths.monacoEditor, () => {
      this.createEditors();
    });

    // wait the "loaded" event before then set the current tab
    this.view().one('loaded', () => {
      setTimeout(() => moveCursorTo(this.field('editViewButton').get()), 50);
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

  buildMenuList(list) {
    const templateElement = this.field('item-template');
    const templateHtml = templateElement.html();
    let listHtml = '';
    list.forEach((item) => {
      listHtml += zuix.$.replaceBraces(templateHtml, (key) => {
        switch (key) {
          case '{link}':
            return item.link;
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
console.log('ERROR');
        downloadCallback('');
      }
    }).catch((err) => {
console.log('ERROR', err);
      downloadCallback('');
    });
    this._isLoading = true;
    m.componentId = `${componentId}.html`;
    download('html', (html) => {
      m.componentId = `${componentId}.css`;
      download('css', (css) => {
        m.componentId = `${componentId}.js`;
        download('js', (js) => {
          this.editorHtml.setValue(html);
          this.editorCss.setValue(css);
          this.editorJs.setValue(js);
          this.componentData = {html, css, js};
          callback(this.componentData);
          this._isLoading = false;
        });
      });
    });
  }

  createEditors() {
    const htmlEditor = this.field('html-editor').show();
    const cssEditor = this.field('css-editor').hide();
    const jsEditor = this.field('js-editor').hide();

    require.config({paths: {vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.37.1/min/vs'}});

    // Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
    // the default worker url location (used when creating WebWorkers). The problem here is that
    // HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
    // a web worker through a same-domain script
    window.MonacoEnvironment = {
      getWorkerUrl: function(workerId, label) {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.37.1/min/'
        };
        importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.37.1/min/vs/base/worker/workerMain.js');`
        )}`;
      }
    };

    require(['vs/editor/editor.main'], () => {
      // create editor instances
      this.editorHtml = monaco.editor.create(htmlEditor.get(), {
        value: '',
        language: 'html',
        automaticLayout: true,
        theme: 'vs-dark'
      });
      this.editorCss = monaco.editor.create(cssEditor.get(), {
        value: '',
        language: 'css',
        automaticLayout: true,
        theme: 'vs-dark'
      });
      this.editorJs = monaco.editor.create(jsEditor.get(), {
        value: '',
        language: 'javascript',
        automaticLayout: true,
        theme: 'vs-dark'
      });

      this.view().one('loaded', () => {
        // set event listeners
        this.editorHtml.getModel().onDidChangeContent((event) => {
          this.componentData.html = this.editorHtml.getValue();
          this.updateWidget();
        });
        this.editorCss.getModel().onDidChangeContent((event) => {
          this.componentData.css = this.editorCss.getValue();
          this.componentContext.style(this.componentData.css);
        });
        this.editorJs.getModel().onDidChangeContent((event) => {
          this.componentData.js = this.editorJs.getValue();
          this.updateWidget();
        });

        if (this.componentData.html || this.componentData.css || this.componentData.js) {
          this.updateWidget();
        } else {
          // TODO: most likely an error occurred loading component's parts
        }

        this._monacoEditorLoaded = true;
      });

      fetch(`${_paths.componentsLibrary}/components/zx-playground/zuix.d.ts`).then((res) => {
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
            this.trigger('loaded');
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
          html,
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

  setError(err) {
    zuix.using('script', 'https://cdn.jsdelivr.net/npm/error-stack-parser@2.1.4/dist/error-stack-parser.min.js', () => {
      ErrorStackParser = self.ErrorStackParser;

      const frames = ErrorStackParser.parse(err);
      const errorFrame = frames[0]; // <-- TODO: find by 'fileName'
      errorFrame.lineNumber -= 2; // adjust source line
      // set error
      //const cm = this.codeModel[WidgetCodeType.JsCode];
      //const model = monaco.editor.getModel(`file:///${cm.uri}`);
      const error = {
        startLineNumber: errorFrame.lineNumber,
        startColumn: errorFrame.columnNumber,
        endLineNumber: errorFrame.lineNumber,
        endColumn: errorFrame.columnNumber,
        message: err.message,
        severity: monaco.MarkerSeverity.Error
      };
      const model = this.editorJs.getModel();
      monaco.editor.setModelMarkers(model, 'service', [error]);

      // check for other errors (view)
      this.checkErrors();
    });
  }
  clearError() {
    const model = this.editorJs.getModel();
    monaco.editor.setModelMarkers(model, 'service', []);
    this.hideErrors();
    this.checkErrors();
  }

  checkErrors() {
    clearTimeout(this._errorCheckTimeout);
    this._errorCheckTimeout = setTimeout(() => {
      const model = this.editorJs.getModel();
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

  showErrors(errorsMessage) {
    this.field('errors-log')
        .html(errorsMessage).parent().show('block');
  }
  hideErrors() {
    this.field('errors-log')
        .html('').parent().hide();
  }

  downloadComponent(componentName = 'component-name') {
    zuix.using('script', '@cdnjs/jszip/3.10.1/jszip.min.js', () => {
      const zip = new JSZip();
      zip.file(`${componentName}.html`, this.componentData.html);
      zip.file(`${componentName}.css`, this.componentData.css);
      zip.file(`${componentName}.js`, this.componentData.js);
      zip.file(`${componentName}.module.js`, `import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';
customElements.define('${componentName}', class extends HTMLElement {
  // change the following value if component
  // location is other than the default one ("/app/")
  componentId = '${componentName}';

  context = null;
  shadowView = null;

  connectedCallback() {
    if (!this.shadowView) {
      this.classList.add('visible-on-ready');
      this.style.display = 'inline-block';
      this.shadowView = this.attachShadow({mode: 'closed'});
      zuix.loadComponent(this, componentId, '', {
        container: this.shadowView,
        ready: (ctx) => this.context = ctx
      });
    }
  }
});`);
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
  the component's path accordinlgly in the \`${componentName}.module.js\` file.

This component was auto-generated from [zuix.js playground](https://zuixjs.org/playground/) on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}.
`);
      zip.generateAsync({type: 'blob'})
          .then(function(content) {
            zuix.using('script', 'https://zuixjs.github.io/zuix/js/zuix-bundler.min.js', () => {
              zuix.saveBlob(content, `${componentName}.zip`);
            });
          });
    });
  }
}
