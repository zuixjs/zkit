/* zUIx v1.0.8 21.10.25 19:40:44 */

var zuix;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 246:
/***/ ((module) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



function AsynChain(callback) {
  listener = callback;
}

AsynChain.prototype.isReady = function() {
  return jobsList.length === 0 || currentIndex === -1;
};
AsynChain.prototype.getJobs = function() {
  return jobsList;
};
AsynChain.prototype.setJobs = function(list) {
  if (jobsList.length > 0) {
    // TODO: this case should never happen
    currentIndex = -1;
    jobsList.length = 0;
    // done();
    return;
  }
  jobsList = list.slice();
  listener.status('start', jobsList);
  next();
};
AsynChain.prototype.append = function(list) {
  // TODO: this is causing stack-overflow
  if (this.isReady()) {
    this.setJobs(list);
  } else {
    Array.prototype.push.apply(jobsList, list);
  }
};

// --------------------------------------------

let jobsList = [];
let currentIndex = -1;
let listener = null;
let lazyThread = null;

function next() {
  resetAsynCallback();
  currentIndex++;
  if (currentIndex < jobsList.length && !listener.willBreak()) {
    worker();
    return true;
  }
  if (currentIndex >= jobsList.length || listener.willBreak()) {
    done();
  }
  return false;
}
function done(reason) {
  currentIndex = -1;
  jobsList.length = 0;
  jobsList = [];
  listener.status(reason != null ? reason : 'done');
}

function worker() {
  const job = jobsList[currentIndex];
  if (job == null) {
    return false;
  }
  const doWork = function() {
    resetAsynCallback();
    if (!listener.doWork(job.item, function() {
      lazyThread = requestAnimationFrame(next);
    })) {
      next();
    }
  };
  if (job.cancelable) {
    if (listener.willBreak()) {
      done('stopped');
    } else if (lazyThread == null) {
      lazyThread = requestAnimationFrame(doWork);
    } else {
      return false;
    }
  } else {
    doWork();
  }
  return true;
}

function resetAsynCallback() {
  if (lazyThread !== null) {
    cancelAnimationFrame(lazyThread);
    lazyThread = null;
  }
}

module.exports = function(callback) {
  return new AsynChain(callback);
};


/***/ }),

/***/ 381:
/***/ ((module) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



const _console_m = [
  'log', 'info', 'warn', 'error', 'debug', 'trace', 'dir', 'group',
  'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd',
  'dirxml', 'assert', 'count', 'markTimeline', 'timeStamp', 'clear'
];
const _bc = 'background-color:rgba(200,200,200,0.2);';
const _bt = 'background-color:transparent;';
const _c1 = 'color:#8a53ff;';
const _c2 = 'color:#777777';
const _c3 = 'color:#888888;';
const _c_start = 'color:#999900;';
const _c_end = 'color:#00aa00;';
const _c_end_very_slow = 'color:#ff0000;';
const _c_end_slow = 'color:#ff7700;';

let _console = null;
let _global = null;
let _callback = null;

/**
 * Simple Logging Helper
 *
 * @class Logger
 * @constructor
 */
function Logger(ctx) {
  _console = window ? window.console : {};
  _global = window ? window : {};
  this._timers = {};
  this.args = function(context, level, args) {
    let logHeader = '%c '+level+' %c'+(new Date().toISOString())+' %c'+context;
    const colors = [_bc+_c1, _bc+_c2, _bc+_c3];
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] == 'string' && args[i].indexOf('timer:') === 0) {
        const t = args[i].split(':');
        if (t.length === 3) {
          let elapsed;
          switch (t[2]) {
            case 'start':
              this._timers[t[1]] = new Date().getTime();
              logHeader += ' %cSTART '+t[1];
              colors.push(_bc+_c_start);
              break;
            case 'stop':
              elapsed = (new Date().getTime() - this._timers[t[1]]);
              logHeader += ' %cSTOP '+t[1]+' '+elapsed+' ms';
              if (elapsed > 200) {
                colors.push(_bc+_c_end_very_slow);
              } else if (elapsed > 100) {
                colors.push(_bc+_c_end_slow);
              } else {
                colors.push(_bc+_c_end);
              }
              break;
          }
        }
      }
    }
    logHeader += ' \n%c '; colors.push(_bt+'color:inherit;');
    // if (typeof args[0] == 'string') {
    //     logHeader += ' %c' + args[0];
    //     Array.prototype.shift.call(args);
    // }
    for (let c = colors.length-1; c >= 0; c--) {
      Array.prototype.unshift.call(args, colors[c]);
    }
    Array.prototype.unshift.call(args, logHeader);
    Array.prototype.push.call(args, '\n\n');
  };
  this.log = function(level, args) {
    if (typeof _callback === 'function') {
      _callback.call(ctx, level, args);
    }
    // route event
    if (!_global.zuixNoConsoleOutput) {
      this.args(ctx, level, args);
      _console.log.apply(_console, args);
    }
  };
}

/**
 * Callback function for monitoring all log messages.
 *
 * @callback LoggerMonitorCallback
 * @param {Object} ctx
 * @param {string} level
 * @param {Object[]} ...args
 * @this {object}
 */

/**
 * Sets a callback function for monitoring all log messages.
 *
 * @param {LoggerMonitorCallback} callback
 * @return undefined
 */
Logger.prototype.monitor = function(callback) {
  // global callback for debugging purpose
  _callback = callback;
};

/**
 *
 * @param {boolean} enable
 * @return undefined
 */
Logger.prototype.console = function(enable) {
  if (enable) {
    window.console = _console;
  } else {
    window.console = {};
    for (let i = 0; i < _console_m.length; i++) {
      if (!window.console[_console_m[i]]) {
        window.console[_console_m[i]] = function() { };
      }
    }
  }
};

/**
 * Logs information messages.
 *
 * @param {Object[]} ...args
 * @return {Logger}
 */
Logger.prototype.info = function() {
  this.log('INFO', arguments);
  return this;
};
Logger.prototype.i = Logger.prototype.l = Logger.prototype.log = Logger.prototype.info;
/**
 * Logs warning messages.
 *
 * @param {Object[]} ...args
 * @return {Logger}
 */
Logger.prototype.warn = function() {
  this.log('WARN', arguments);
  return this;
};
Logger.prototype.w = Logger.prototype.warn;
/**
 * Logs error messages.
 *
 * @param {Object[]} ...args
 * @return {Logger}
 */
Logger.prototype.error = function() {
  this.log('ERROR', arguments);
  return this;
};
Logger.prototype.e = Logger.prototype.error;
/**
 * Logs debug messages.
 *
 * @param {Object[]} ...args
 * @return {Logger}
 */
Logger.prototype.debug = function() {
  this.log('DEBUG', arguments);
  return this;
};
Logger.prototype.d = Logger.prototype.debug;
/**
 * Logs trace messages.
 *
 * @param {Object[]} ...args
 * @return {Logger}
 */
Logger.prototype.trace = function() {
  this.log('TRACE', arguments);
  return this;
};
Logger.prototype.t = Logger.prototype.trace;

module.exports = function(ctx) {
  return new Logger(ctx);
};


/***/ }),

/***/ 65:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



const _log =
    __webpack_require__(381)('TaskQueue.js');

/**
 * Task Queue Manager
 *
 * @class TaskQueue
 * @constructor
 */
function TaskQueue(listener) {
  const _t = this;
  _t._worker = null;
  _t._taskList = [];
  _t._requests = [];
  if (listener == null) {
    listener = function() { };
  }
  _t.taskQueue = function(tid, fn, pri) {
    _t._taskList.push({
      tid: tid,
      fn: fn,
      status: 0,
      priority: pri,
      step: function(tid) {
        // var _h = this;
        // _h.tid = tid;
        _log.t(tid, 'load:step');
        listener(_t, 'load:step', {
          task: tid
        });
      },
      end: function() {
        this.status = 2;
        const _h = this;
        _log.t(_h.tid, 'load:next', 'timer:task:stop');
        listener(_t, 'load:next', {
          task: _h.tid
        });
        _t._taskList.splice(this.index, 1);
        _t.taskCheck();
        if (this._callback != null) {
          this._callback.call(this);
        }
      },
      callback: function(callback) {
        this._callback = callback;
      }
    });
    _log.t(tid, 'task added', pri, 'priority');
    _t._taskList.sort(function(a, b) {
      return (a.priority > b.priority) ?
                1 :
                ((b.priority > a.priority) ?
                    -1 : 0);
    } );
    _t.taskCheck();
  };
  _t.taskCheck = function() {
    for (let i = 0; i < _t._taskList.length; i++) {
      if (_t._taskList[i].status === 0) {
        _t._taskList[i].status = 1;
        _log.t(_t._taskList[i].tid, 'load:begin', 'timer:task:start');
        listener(_t, 'load:begin', {
          task: _t._taskList[i].tid
        });
        _t._taskList[i].index = i;
        (_t._taskList[i].fn).call(_t._taskList[i]);
        return;
      } else if (_t._taskList[i].status === 1) {
        // currently running
        return;
      } else if (_t._taskList[i].status === 2) {
        // TODO: _!!!-!
        return;
      }
    }
    _log.t('load:end');
    listener(_t, 'load:end');
  };
}

/**
 *
 * @param handler {function}
 */
TaskQueue.prototype.callback = function(handler) { };
TaskQueue.prototype.queue = function(tid, fn, pri) {
  return this.taskQueue(tid, fn, pri);
};

module.exports = TaskQueue;


/***/ }),

/***/ 826:
/***/ ((module) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



// Generic utility class
module.exports = {

  isIE: function() {
    return (window.navigator.userAgent.indexOf('Trident') > 0);
  },

  isNoU: function(obj) {
    return (typeof obj === 'undefined' || obj === null);
  },

  isFunction: function(f) {
    return typeof f === 'function';
  },

  objectEquals: function(x, y) {
    if (x === null || x === undefined || y === null || y === undefined) {
      return x === y;
    }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
      return false;
    }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {
      return x === y;
    }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {
      return x === y;
    }
    if (x === y || x.valueOf() === y.valueOf()) {
      return true;
    }
    if (Array.isArray(x) && x.length !== y.length) {
      return false;
    }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {
      return false;
    }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {
      return false;
    }
    if (!(y instanceof Object)) {
      return false;
    }

    // recursive object equality check
    const p = Object.keys(x);
    return Object.keys(y).every(function(i) {
      return p.indexOf(i) !== -1;
    }) &&
            p.every(function(i) {
              return util.objectEquals(x[i], y[i]);
            });
  },

  propertyFromPath: function(o, s) {
    if (typeof s !== 'string') {
      return;
    }
    let ref = o; let path = '';
    const parts = s.match(/\[(".*?"|'.*?'|(.*?))\]|".*?"|'.*?'|[0-9a-zA-Z_$]+/g);
    for (let i = 0; i < parts.length; i++) {
      let m = parts[i];
      if (m.startsWith('[') && m.endsWith(']')) {
        m = m.substring(1, m.length - 1).trim();
      }
      if (m.startsWith('"') && m.endsWith('"')) {
        m = m.substring(1, m.length - 1);
      } else if (m.startsWith('\'') && m.endsWith('\'')) {
        m = m.substring(1, m.length - 1);
      }
      path = path + m;
      if (typeof ref[m] !== 'undefined') {
        ref = ref[m];
      } else {
        // TODO: maybe logging?
        // throw new Error('Undefined property "' + path + '"');
        return;
      }
      path = path + '->';
    }
    return ref;
  },

  cloneObject: function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    // Give temp the original obj's constructor
    // var temp = obj.constructor();
    // for (var key in obj)
    //    temp[key] = cloneObject(obj[key]);
    let temp = obj;
    try {
      temp = obj.constructor();
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          temp[key] = cloneObject(obj[key]);
        }
      }
    } catch (e) {
      // TODO: should warn when clone is not possible
    }
    return temp;
  },

  hasPassiveEvents: function hasPassiveEvents() {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
        }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {}
    return supportsPassive;
  },

  dom: {

    queryAttribute: function(name, value, appendValue) {
      const fields = name.split(',');
      let selector = '';
      fields.forEach(function(v, i) {
        if (value != null) {
          selector += '[' + v + '="' + value + '"]';
        } else {
          selector += '[' + v + ']';
        }
        if (appendValue) {
          selector += appendValue.get(i);
        }
        if (i < fields.length - 1) selector += ',';
      });
      return selector;
    },
    getAttribute: function(element, name) {
      let value;
      if (typeof name === 'string' && name.indexOf(',') !== -1) {
        const fields = name.split(',');
        for (let i = 0; i < fields.length; i++) {
          const f = fields[i];
          const a = element.getAttribute(f);
          if (a != null) {
            value = a;
            break;
          }
        }
      } else value = element.getAttribute(name);
      return value;
    },
    setAttribute: function(element, name, value) {
      if (typeof name === 'string' && name.indexOf(',') !== -1) {
        const fields = name.split(',');
        const _t = this;
        fields.forEach(function(f) {
          _t.setAttribute(element, f, value);
        });
      } else if (value === null) {
        element.removeAttribute(name, value);
      } else {
        element.setAttribute(name, value);
      }
    },
    cssNot: function(name, value) {
      const fields = name.split(',');
      let selector = '';
      fields.forEach(function(v, i) {
        if (v.startsWith('.')) {
          selector += ':not(' + v + ')';
        } else if (value != null) {
          selector += ':not([' + v + '="' + value + '"])';
        } else {
          selector += ':not([' + v + '])';
        }
        if (i < fields.length - 1) selector += ',';
      });
      return (function(s) {
        return {
          get: function(i) {
            const selectors = s.split(',');
            return (i >= selectors.length || i == null) ? selectors[0] : selectors[i];
          },
          getAll: function(i) {
            const selectors = s.split(',');
            return selectors.join('');
          }
        };
      })(selector);
    }

  }

};


/***/ }),

/***/ 917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



const _log =
    __webpack_require__(381)('TaskQueue.js');
const util = __webpack_require__(826);


// Types definitions for JsDoc

/**
 * Callback function used with the `each(..)` method.
 *
 * @callback ElementsIterationCallback
 * @param {number} count Iteration count.
 * @param {Element} item Current element.
 * @param {ZxQuery} $item ZxQuery wrapped element (same as 'this').
 * @this {ZxQuery}
 */

/**
 * Relative position.
 *
 * @typedef {object} Position
 * @memberOf {ZxQueryStatic}
 * @property {number} dx
 * @property {number} dy
 */

/**
 * The `ElementPosition` object returned by the `position()` method.
 *
 * @typedef {object} ElementPosition
 * @memberOf {ZxQueryStatic}
 * @property {number} x X coordinate of the element in the viewport.
 * @property {number} y Y coordinate of the element in the viewport.
 * @property {Position} frame Position of the element relative to the viewport
 * @property {string} event Current state change event description ("enter"|"exit"|"scroll"|"off-scroll")
 * @property {boolean} visible Boolean value indicating whether the element is visible in the viewport.
 */

/**
 * The `IterationCallback` function.
 *
 * @callback IterationCallback
 * @memberOf {ZxQueryStatic}
 * @param {number} i Iteration count.
 * @param {object} item Current element (same as `this`).
 * @this {object}
 */

/**
 * The `ZxQueryHttpBeforeSendCallback` function.
 *
 * @callback ZxQueryHttpBeforeSendCallback
 * @memberOf {ZxQueryStatic}
 * @param {XMLHttpRequest} xhr
 * @this {undefined}
 */

/**
 * The `ZxQueryHttpSuccessCallback` function.
 *
 * @callback ZxQueryHttpSuccessCallback
 * @memberOf {ZxQueryStatic}
 * @param {string} responseText
 * @this {undefined}
 */

/**
 * The `ZxQueryHttpErrorCallback` function.
 *
 * @callback ZxQueryHttpErrorCallback
 * @memberOf {ZxQueryStatic}
 * @param {XMLHttpRequest} xhr
 * @param {string} statusText
 * @param {number} statusCode
 * @this {undefined}
 */

/**
 * The `ZxQueryHttpThenCallback` function.
 *
 * @callback ZxQueryHttpThenCallback
 * @memberOf {ZxQueryStatic}
 * @param {XMLHttpRequest} xhr
 * @this {undefined}
 */

/**
 * zuix.$.http options object.
 *
 * @typedef {object} ZxQueryHttpOptions
 * @memberOf {ZxQueryStatic}
 * @property {string} url
 * @property {ZxQueryHttpBeforeSendCallback|undefined} beforeSend
 * @property {ZxQueryHttpSuccessCallback|undefined} success
 * @property {ZxQueryHttpErrorCallback|undefined} error
 * @property {ZxQueryHttpThenCallback|undefined} then
 */

/** @private */
const supportsPassive = util.hasPassiveEvents();

/** @private */
const _zuix_events_mapping = [];
function routeEvent(e) {
  triggerEventHandlers(this, e.type, e);
}
function addEventHandler(el, path, handler, options) {
  let found = false;
  z$.each(_zuix_events_mapping, function() {
    if (this.element === el && this.path === path && this.handler === handler) {
      _log.w('Handler already registered', el, path, handler);
      found = true;
      return false;
    }
  });
  if (!found) {
    _zuix_events_mapping.push({element: el, path: path, handler: handler, opgions: options});
    el.addEventListener(path, routeEvent, supportsPassive && (options == null || options.passive !== false) ? {passive: true} : false);
  }
}
function removeEventHandler(el, path, handler) {
  let left = 1;
  let index = -1;
  z$.each(_zuix_events_mapping, function(i) {
    if (this.element === el && this.path === path && this.handler === handler) {
      left--;
      index = i;
    }
  });
  if (index !== -1) {
    _zuix_events_mapping.splice(index, 1);
  }
  // unregister event handler since it was the last one
  if (left === 0) {
    el.removeEventListener(path, routeEvent);
  }
}
function triggerEventHandlers(el, path, evt) {
  const element = z$(el);
  z$.each(_zuix_events_mapping, function() {
    if (this.element === el && this.path === path) {
      this.handler.call(element, evt, element);
    }
  });
}
function removeAllEventHandlers(el) {
  z$.each(_zuix_events_mapping, function() {
    if (this.element === el) {
      _log.t('Removing event handler', this.element, this.path, this.handler);
      removeEventHandler(this.element, this.path, this.handler);
    }
  });
}

/**
 * ZxQuery, a very lite subset of jQuery-like functions
 * internally used in Zuix for DOM operations.
 *
 * The constructor takes one optional argument that can be
 * a DOM element, a node list or a valid DOM query selector string expression.
 * If no parameter is given, the resulting ZxQuery object will wrap the
 * root *document* element.
 *
 * @class ZxQuery
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined} [element] Element or list of elements to include in the ZxQuery object.
 * @return {ZxQuery} The *ZxQuery* object containing the given element(s).
 * @constructor
 */
function ZxQuery(element) {
  /** @protected */
  this._selection = [];

  if (typeof element === 'undefined') {
    element = document.documentElement;
  }

  if (element instanceof ZxQuery) {
    return element;
  } else if (element instanceof HTMLCollection || element instanceof NodeList) {
    const list = this._selection = [];
    z$.each(element, function(i, el) {
      list.push(el);
    });
  } else if (Array.isArray(element)) {
    this._selection = element;
  } else if (element === window || element instanceof HTMLElement || element instanceof Node) {
    this._selection = [element];
  } else if (typeof element === 'string') {
    this._selection = document.documentElement.querySelectorAll(element);
  } else if (element !== null) { // if (typeof element === 'string') {
    _log.e('ZxQuery cannot wrap object of this type.', (typeof element), element);
    throw new Error('ZxQuery cannot wrap object of this type.');
  }
  return this;
}


/**
 * Gets the number of elements in the ZxQuery object.
 *
 * @return {Number} Number of DOM elements.
 */
ZxQuery.prototype.length = function() {
  return this._selection.length;
};
/**
 * Gets the closest parent matching the given selector filter.
 * This only applies to the first element in the ZxQuery object.
 *
 * @param {string} [filter] A valid DOM query selector filter (**default:** *first parent*).
 * @return {ZxQuery} A new *ZxQuery* object containing the matching parent element.
 */
ZxQuery.prototype.parent = function(filter) {
  if (!util.isNoU(filter)) {
    return new ZxQuery(z$.getClosest(this._selection[0], filter));
  }
  return new ZxQuery(this._selection[0].parentNode);
};
/**
 * Gets the children matching the given selector filter.
 * This only applies to the first element in the ZxQuery object.
 *
 * @param {string} [filter] A valid DOM query selector filter (**default:** *all children*).
 * @return {ZxQuery}  A new *ZxQuery* object containing the selected *children*.
 */
ZxQuery.prototype.children = function(filter) {
  // TODO: implement filtering
  if (!util.isNoU(filter)) {
    return new ZxQuery(this._selection[0].querySelectorAll(filter));
  }
  return new ZxQuery(this._selection[0].children);
};
/**
 * Reverses order of the elements in the current set.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.reverse = function() {
  const elements = (Array.prototype.slice).call(this._selection, 0);
  this._selection = elements.reverse();
  return this;
};
/**
 * Gets the DOM Element located at the given position in the ZxQuery object.
 * If no index is provided, the default element will be returned.
 *
 * @param {number} [i] Position of element (**default:** 0).
 * @return {Node|Element} The *DOM* element.
 */
ZxQuery.prototype.get = function(i) {
  if (util.isNoU(i)) i = 0;
  return this._selection[i];
};
/**
 * Gets a new ZxQuery object containing the element
 * located at the given position in the current ZxQuery object.
 *
 * @param {number} i Position of element.
 * @return {ZxQuery} A new *ZxQuery* object containing the selected element.
 */
ZxQuery.prototype.eq = function(i) {
  const selection = this._selection;
  let resultSet = selection[i];
  if (arguments.length > 1) {
    resultSet = [];
    z$.each(arguments, function(k, v) {
      if (selection[v] != null) {
        resultSet.push(selection[v]);
      }
    });
  }
  return new ZxQuery(resultSet);
};
/**
 * Selects all descendants matching the given *DOM* query selector filter.
 * This only applies to the first element in the ZxQuery object.
 *
 * @param {string} selector A valid *DOM* query selector.
 * @return {ZxQuery} A new *ZxQuery* object containing the selected elements.
 */
ZxQuery.prototype.find = function(selector) {
  return new ZxQuery(this._selection[0].querySelectorAll(selector));
};
/**
 * Iterates through all *DOM* elements in the selection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)` function, will be the
 * *DOM* element corresponding the current iteration.
 * `index` will be the iteration count, and `item`
 * the current Element. The function context `this` will be a
 * `{ZxQuery}` instance containing the current `item`.
 * To interrupt the iteration loop, return `false` in the callback
 * function or return `true` to continue to the next iteration.
 *
 * @param {ElementsIterationCallback} iterationCallback The callback function to call for each element in the ZxQuery object.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.each = function(iterationCallback) {
  z$.each(this._selection, iterationCallback);
  return this;
};
/**
 * Gets the value of an attribute for the first element in the ZxQuery object,
 * or sets one or more attributes for all elements in the ZxQuery object.
 *
 * @param {string|JSON} attr The attribute name.
 * @param {string|undefined} [val] The attribute value.
 * @return {string|ZxQuery} The *attr* attribute value when no *val* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.attr = function(attr, val) {
  const _t = this;
  if (typeof attr === 'object') {
    z$.each(attr, function(i, v) {
      _t.each(function(k, el) {
        util.dom.setAttribute(el, i, v);
      });
    });
  } else if (typeof val == 'undefined') {
    return util.dom.getAttribute(this._selection[0], attr);
  } else {
    this.each(function(k, v) {
      util.dom.setAttribute(this.get(), attr, val);
    });
  }
  return this;
};
/**
 * Triggers the given event for all elements in the ZxQuery object.
 *
 * @param {string} eventPath Path of the event to trigger.
 * @param {object} eventData Value of the event.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.trigger = function(eventPath, eventData) {
  let event;
  if (window.CustomEvent) {
    event = new CustomEvent(eventPath, {detail: eventData});
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventPath, true, true, eventData);
  }
  this.each(function(k, el) {
    el.dispatchEvent(event);
  });
  return this;
};
/**
 * Listens once to the given event for all elements in the ZxQuery object.
 *
 * @param {string} eventPath Event path.
 * @param {function} eventHandler Event handler.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.one = function(eventPath, eventHandler) {
  let fired = false;
  this.on(eventPath, function(a, b) {
    if (fired) return;
    fired = true;
    z$(this).off(eventPath, eventHandler);
    (eventHandler).call(this, a, b, this);
  });
  return this;
};
/**
 * Listens to the given event for all elements in the ZxQuery object.
 *
 * @param {string} eventPath Event path.
 * @param {function} eventHandler Event handler.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.on = function(eventPath, eventHandler) {
  const events = eventPath.match(/\S+/g) || [];
  let options;
  if (typeof eventHandler !== 'function') {
    options = eventHandler;
    eventHandler = options.handler;
  }
  this.each(function(k, el) {
    z$.each(events, function(k, ev) {
      addEventHandler(el, ev, eventHandler, options);
    });
  });
  return this;
};
/**
 * Stops listening for the given event.
 * @param {string} eventPath Event path.
 * @param {function} eventHandler Event handler.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.off = function(eventPath, eventHandler) {
  const events = eventPath.match(/\S+/g) || [];
  this.each(function(k, el) {
    z$.each(events, function(k, ev) {
      removeEventHandler(el, ev, eventHandler);
    });
  });
  return this;
};
/**
 * De-register all event handlers of all elements in the ZxQuery object.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.reset = function() {
  this.each(function(k, el) {
    removeAllEventHandlers(el);
  });
  return this;
};
/**
 * Returns *true* if the first element markup code is empty.
 *
 * @return {boolean} *true* if the element is empty, *false* otherwise.
 */
ZxQuery.prototype.isEmpty = function() {
  return (this._selection[0].innerHTML.replace(/\s/g, '').length === 0);
};
/**
 * Gets coordinates and visibility status of the first element.
 *
 * @return {ElementPosition}
 */
ZxQuery.prototype.position = function() {
  if (this._selection[0] != null) {
    return z$.getPosition(this._selection[0]);
  } else {
    // TODO: check this out; should prevent this from happening
    return {x: -1, y: -1, visible: false};
  }
};

/**
 * Gets the value of a CSS property for the first element in the ZxQuery object,
 * or sets one or more CSS property for all elements in the ZxQuery object.
 *
 * @param {string|JSON} prop The CSS property name or JSON list of property/value pairs.
 * @param {string|undefined} [val] The CSS property value.
 * @return {string|ZxQuery} The CSS property value when no *val* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.css = function(prop, val) {
  const _t = this;
  if (typeof prop === 'object') {
    z$.each(prop, function(i, v) {
      _t.each(function(k, el) {
        el.style[i] = v;
      });
    });
  } else if (util.isNoU(val)) {
    return this._selection[0].style[prop];
  } else {
    _t.each(function(k, el) {
      el.style[prop] = val;
    });
  }
  return this;
};
/**
 * Adds the given CSS class to the class list of all elements in the ZxQuery object.
 *
 * @param {string} className The CSS class name.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.addClass = function(className) {
  const classes = className.match(/\S+/g) || [];
  z$.each(this._selection, function(k, el) {
    if (el.classList) {
      z$.each(classes, function(k, cl) {
        el.classList.add(cl);
      });
    } else el.className += ' ' + className;
  });
  return this;
};
/**
 * Returns *true* if the first element in the ZxQuery object contains the given CSS class.
 *
 * @param {string} className The CSS class name.
 * @return {boolean} *true* if the element contains the given CSS class, *false* otherwise.
 */
ZxQuery.prototype.hasClass = function(className) {
  return z$.hasClass(this._selection[0], className);
};
/**
 * Removes the given CSS class from all elements in the ZxQuery object.
 *
 * @param {string} className The CSS class name.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.removeClass = function(className) {
  const classes = className.match(/\S+/g) || [];
  z$.each(this._selection, function(k, el) {
    if (el.classList) {
      z$.each(classes, function(k, cl) {
        el.classList.remove(cl);
      });
    } else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  });
  return this;
};
/**
 * Moves to the previous sibling in the DOM.
 * This only applies to the first element in the ZxQuery object.
 *
 * @return {ZxQuery} A new *ZxQuery* object containing the previous sibling element.
 */
ZxQuery.prototype.prev = function() {
  return new ZxQuery(this._selection[0].previousElementSibling);
};
/**
 * Moves to the next sibling in the DOM.
 * This only applies to the first element in the ZxQuery object.
 *
 * @return {ZxQuery} A new *ZxQuery* object containing the next sibling element.
 */
ZxQuery.prototype.next = function() {
  return new ZxQuery(this._selection[0].nextElementSibling);
};
/**
 * Gets the HTML string of the first element in the ZxQuery object,
 * or sets the HTML string for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [htmlText] HTML text.
 * @return {ZxQuery|string}
 */
ZxQuery.prototype.html = function(htmlText) {
  if (util.isNoU(htmlText)) {
    return this._selection[0].innerHTML;
  }
  this.each(function(k, el) {
    el.innerHTML = htmlText;
  });
  return this;
};
/**
 * Gets the `checked` attribute of the first element in the ZxQuery object,
 * or sets the `checked` attribute value for all elements in the ZxQuery object.
 *
 * @param {boolean|undefined} [check] Value to assign to the 'checked' attribute.
 * @return {ZxQuery|boolean}
 */
ZxQuery.prototype.checked = function(check) {
  if (util.isNoU(check)) {
    const checked = this._selection[0].checked;
    return (checked != null && checked != 'false' && (checked || checked == 'checked'));
  }
  this.each(function(k, el) {
    el.checked = check;
  });
  return this;
};
/**
 * Gets the `value` attribute of the first element in the ZxQuery object,
 * or sets the `value` attribute value for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [value] Value to assign to the 'value' attribute.
 * @return {ZxQuery|string}
 */
ZxQuery.prototype.value = function(value) {
  if (util.isNoU(value)) {
    return this._selection[0].value;
  }
  this.each(function(k, el) {
    el.value = value;
  });
  return this;
};
/**
 * Appends the given element or HTML string to the first element in the ZxQuery object.
 *
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element or HTML to append.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.append = function(el) {
  if (typeof el === 'string') {
    this._selection[0].innerHTML += el;
  } else {
    this._selection[0].appendChild(el);
  }
  return this;
};
/**
 * Inserts the given child element before the one located at the specified index
 * to the first element in the ZxQuery object.
 *
 * @param {number} index Position where to insert `el` Element.
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList} el Element to insert.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.insert = function(index, el) {
  const target = this.children().get(index);
  if (target !== null) {
    this._selection[0].insertBefore(el, target);
  } else {
    this._selection[0].appendChild(el);
  }
  return this;
};
/**
 * Prepends the given element or HTML string to the first element in the ZxQuery object.
 *
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element to append.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.prepend = function(el) {
  if (typeof el === 'string') {
    this._selection[0].innerHTML = el + this._selection[0].innerHTML;
  } else {
    this._selection[0].insertBefore(el, this._selection[0].firstElementChild);
  }
  return this;
};
/**
 * Detach from its parent the first element in the ZxQuery object.
 *
 * @return {ZxQuery}
 */
ZxQuery.prototype.detach = function() {
  const el = this._selection[0];
  const parent = el.parentNode;
  if (parent != null) {
    el.__zuix_oldParent = parent;
    el.__zuix_oldIndex = Array.prototype.indexOf.call(parent.children, el);
    parent.removeChild(el);
    _log.t('Detached from parent', parent, el);
  }
  return this;
};
/**
 * Re-attach to its parent the first element in the ZxQuery object.
 *
 * @return {ZxQuery}
 */
ZxQuery.prototype.attach = function() {
  const el = this._selection[0];
  if (el.parentNode != null && el.__zuix_oldParent != null) {
    el.parentNode.removeChild(el);
  }
  if (el.parentNode == null && el.__zuix_oldParent != null) {
    z$(el.__zuix_oldParent).insert(el.__zuix_oldIndex, el);
    el.__zuix_oldParent = null;
    delete el.__zuix_oldParent;
    delete el.__zuix_oldIndex;
  }
  return this;
};
/**
 * Gets the CSS `display` property of the first element in the ZxQuery object,
 * or sets the `display` property value for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [mode] The display value.
 * @return {string|ZxQuery} The *display* value when no *mode* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.display = function(mode) {
  if (util.isNoU(mode)) {
    return this._selection[0].style.display;
  }
  z$.each(this._selection, function(k, el) {
    el.style.display = mode;
  });
  return this;
};
/**
 * Gets the CSS `visibility` property of the first element in the ZxQuery object,
 * or sets the `visibility` property value for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [mode] The visibility value.
 * @return {string|ZxQuery} The *visibility* value when no *mode* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.visibility = function(mode) {
  if (util.isNoU(mode)) {
    return this._selection[0].style.visibility;
  }
  z$.each(this._selection, function(k, el) {
    el.style.visibility = mode;
  });
  return this;
};
/**
 * Sets the CSS `display` property to '' if no argument value is provided, otherwise set it to the given value.
 *
 * @param {string} [mode] Set the display mode to be used to show element (eg. block, inline, etc..).
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.show = function(mode) {
  return this.display(mode == null ? '' : mode);
};
/**
 * Sets the CSS `display` property to 'none'.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.hide = function() {
  return this.display('none');
};

// --- ZxQuery factory members --- //

/**
 * Creates a ZxQuery wrapped element.
 *
 * @class {ZxQueryStatic}
 * @alias zuix.$
 * @memberOf {ZxQueryStatic}
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined} [what] Query target
 * @return {ZxQuery}
 */
function ZxQueryStatic(what) {
  return new ZxQuery(what);
}
const z$ = ZxQueryStatic;
/**
 * Selects document elements matching the given *DOM* query selector.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.find
 * @param {string} selector A valid *DOM* query selector.
 * @return {ZxQuery} A new *ZxQuery* object containing the selected elements.
 */
ZxQueryStatic.find = function(selector) {
  return z$().find(selector);
};
/**
 * Iterate through all objects in the given `items` collection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)`, will be the
 * object corresponding the current iteration and
 * the `index` passed to the callback will be the iteration count.
 *
 * If the callback returns *false*, the iteration loop will interrupt.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.each
 * @param {Array<Object>|JSON} items Enumerable objects collection.
 * @param {IterationCallback} iterationCallback The callback *fn* to call at each iteration
 * @return {ZxQuery} `this`.
 */
ZxQueryStatic.each = function(items, iterationCallback) {
  const len = (items == null ? 0 : Object.keys(items).length);
  if (len > 0) {
    let count = 0;
    for (const i in items) {
      if (items.hasOwnProperty(i)) {
        let item = items[i];
        if (item instanceof Element) {
          item = z$(item);
        }
        if (iterationCallback.call(item, i, items[i], item) === false) {
          break;
        }
        count++;
        if (count >= len) {
          break;
        }
      }
    }
  }
  return this;
};
ZxQueryStatic.ajax =
/**
 * Makes an HTTP request.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.http
 * @param {ZxQueryHttpOptions} options
 * @return {ZxQueryStatic}
 */
ZxQueryStatic.http = function(options) {
  let url;
  if (!util.isNoU(options) && !util.isNoU(options.url)) {
    url = options.url;
  } else {
    url = options;
  }
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
    if (xhr.status === 200) {
      if (util.isFunction(options.success)) options.success(xhr.responseText);
    } else {
      if (util.isFunction(options.error)) options.error(xhr, xhr.statusText, xhr.status);
    }
    if (util.isFunction(options.then)) options.then(xhr);
  };
  xhr.onerror = function(xhr, textStatus, errorThrown) {
    if (util.isFunction(options.error)) options.error(xhr, textStatus, errorThrown);
  };
  if (typeof options.beforeSend == 'function') {
    options.beforeSend(xhr);
  }
  try {
    xhr.open('GET', url);
    xhr.send();
  } catch (e) {
    if (util.isFunction(options.error)) options.error(xhr, xhr.statusText, xhr.status, e);
  }
  return this;
};
/**
 * Checks if an element has got the specified CSS class.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.hasClass
 * @param {Element} el
 * @param {string} className
 * @return {boolean}
 */
ZxQueryStatic.hasClass = function(el, className) {
  const classes = className.match(/\S+/g) || [];
  let success = false;
  z$.each(classes, function(k, cl) {
    if (el.classList) {
      success = el.classList.contains(cl);
    } else {
      success = (new RegExp('(^| )' + cl + '( |$)', 'gi').test(el.className));
    }
    if (success) return false;
  });
  return success;
};
/**
 * Checks if a class exists by searching for it in all document stylesheets.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.classExists
 * @param {string} className
 * @return {boolean}
 */
ZxQueryStatic.classExists = function(className) {
  const classes = className.match(/\S+/g) || [];
  let success = false;
  z$.each(classes, function(k, cl) {
    // Perform global style check
    const docStyles = document.styleSheets;
    if (docStyles != null) {
      for (let sx = 0; sx < docStyles.length; sx++) {
        // the try statement is needed because on Firefox accessing CSS rules
        // loaded from a remote source will raise a security exception
        try {
          const classes = docStyles[sx].rules || docStyles[sx].cssRules;
          if (classes != null) {
            for (let cx = 0; cx < classes.length; cx++) {
              if (classes[cx].selectorText === cl) {
                success = true;
                break;
              }
            }
          }
        } catch (e) {
          if (e.name !== 'SecurityError' && e.name !== 'InvalidAccessError') {
            throw e;
          }
        }
      }
    }
  });
  return success;
};
/**
 * Wraps an {Element} inside a container specified by a given tag name.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.wrapElement
 * @param {string} containerTag Container element tag name
 * @param {Element} element
 * @return {Element} The new wrapped element
 */
ZxQueryStatic.wrapElement = function(containerTag, element) {
  // $(element).wrap($('<'+containerTag+'/>'));
  // return element;
  /** @type Element */
  const container = document.createElement(containerTag);
  if (typeof element === 'string') {
    container.innerHTML = element;
  } else {
    // TODO: test this, it may not work
    container.appendChild(element);
  }
  return container;
};
// TODO: undocumented
ZxQueryStatic.wrapCss = function(wrapperRule, css, encapsulate) {
  const wrapReX = /(([a-zA-Z0-9\240-\377=:-_\n,.@]+.*){([^{}]|((.*){([^}]+)[}]))*})/g;
  let wrappedCss = '';
  let ruleMatch;
  // remove comments
  css = css.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g, '');
  do {
    ruleMatch = wrapReX.exec(css);
    if (ruleMatch && ruleMatch.length > 1) {
      let ruleParts = ruleMatch[2];
      if (ruleParts != null && ruleParts.length > 0) {
        ruleParts = ruleParts.replace(/\n/g, '');
        const classes = ruleParts.split(',');
        let isMediaQuery = false;
        z$.each(classes, function(k, v) {
          if (v.trim() === '.' || v.trim() === ':host') {
            // a single `.` means 'self' (the container itself)
            // so we just add the wrapperRule
            wrappedCss += '\n[z-component]' + wrapperRule + ' ';
          } else if (v.trim()[0] === '@') {
            // leave it as is if it's an animation or media rule
            wrappedCss += v + ' ';
            if (v.trim().toLowerCase().startsWith('@media')) {
              isMediaQuery = true;
            }
          } else if (encapsulate) {
            // wrap the class names (v)
            v.split(/\s+/).forEach(function(attr) {
              attr = attr.trim();
              if (attr.lastIndexOf('.') > 0) {
                attr.split('.').forEach(function(attr2) {
                  if (attr2 !== '') {
                    wrappedCss += '.' + attr2 + wrapperRule;
                  }
                });
              } else if (attr !== '') {
                wrappedCss += '\n' + attr + wrapperRule + ' ';
              }
            });
          } else {
            wrappedCss += '\n[z-component]' + wrapperRule + '\n' + v.trim() + ' ';
          }
          if (k < classes.length - 1) {
            wrappedCss = wrappedCss.trim() + ', ';
          }
        });
        if (isMediaQuery) {
          const wrappedMediaQuery = z$.wrapCss(wrapperRule, ruleMatch[1].substring(ruleMatch[2].length).replace(/^{([^\0]*?)}$/, '$1'), encapsulate);
          wrappedCss += '{\n  '+wrappedMediaQuery+'\n}';
        } else {
          wrappedCss += ruleMatch[1].substring(ruleMatch[2].length) + '\n';
        }
      } else {
        _log.w('z$.wrapCss was unable to parse rule.', ruleParts, ruleMatch);
      }
    }
  } while (ruleMatch);
  if (wrappedCss !== '') {
    css = wrappedCss;
  }
  return css;
};
/**
 * Appends or replaces a stylesheet to the document.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.appendCss
 * @param {string} css Stylesheet text
 * @param {Element|null} target Existing style element to replace
 * @param {string} cssId id to assign to the stylesheet
 * @return {Element} The new style element created out of the given css text.
 */
ZxQueryStatic.appendCss = function(css, target, cssId) {
  const head = document.head || document.getElementsByTagName('head')[0];
  let style = null;
  // remove old style if already defined
  if (!util.isNoU(target)) {
    head.removeChild(target);
  } else {
    const oldStyle = document.getElementById(cssId);
    if (oldStyle != null) {
      head.removeChild(oldStyle);
    }
  }
  if (typeof css === 'string') {
    // output css
    style = document.createElement('style');
    style.type = 'text/css';
    style.id = cssId;
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  } else if (css instanceof Element) style = css;
  // Append new CSS
  if (!util.isNoU(style)) {
    head.appendChild(style);
  }
  return style;
};
/**
 * Replaces CSS variables with provided values.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.replaceCssVars
 * @param {string} css Stylesheet text
 * @param {object} model Object containing variables fields and values.
 * @return {string} The new stylesheet text with variables replaced with values
 */
ZxQueryStatic.replaceCssVars = function(css, model) {
  const vars = new RegExp(/\B\$var\[(.*[^\[\]])]/g);
  let outCss = '';
  let matched = 0;
  let currentIndex = 0;
  let result;
  while (result = vars.exec(css)) {
    let value = result[0];
    if (result.length > 1) {
      const name = result[1];
      // resolve dotted field path
      let cur = model;
      if (name.indexOf('.') > 0) {
        const path = name.split('.');
        for (let p = 0; p < path.length - 1; p++) {
          cur = cur[path[p]];
          if (typeof cur === 'undefined') {
            break;
          }
        }
        if (typeof cur !== 'undefined') {
          value = cur[path[path.length - 1]];
          matched++;
        }
      } else if (typeof cur[name] !== 'undefined') {
        value = cur[name];
        matched++;
      }
    }
    outCss += css.substr(currentIndex, result.index-currentIndex)+value;
    currentIndex = result.index+result[0].length;
  }
  if (matched > 0) {
    outCss += css.substr(currentIndex);
    css = outCss;
  }
  return css;
};
/**
 * Parses variables enclosed in single or double braces and calls the given callback for each parsed variable name.
 * If the callback returns a value, then the variable will be replaced with the given value.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.replaceBraces
 * @param {string} html The source HTML template.
 * @param {function} callback A callback function with one argument (the currently parsed variable name).
 * @return {string|null} The new html code with variables replaced with values or null if no variable was replaced.
 */
ZxQueryStatic.replaceBraces = function(html, callback) {
  // TODO: add optional parameter for custom regex
  const tags = new RegExp(/{?{.*?}?}/g); // <-- single/double braces wrapper
  let outHtml = '';
  let matched = 0;
  let currentIndex = 0;
  let result;
  while (result = tags.exec(html)) {
    if (typeof result[0] === 'string' && (result[0].trim().length === 0 || result[0].indexOf('\n') >= 0)) {
      const nv = html.substr(currentIndex, result.index-currentIndex)+result[0];
      outHtml += nv;
      currentIndex += nv.length;
      continue;
    }
    let value = result[0];
    if (typeof callback === 'function') {
      const r = callback(result[0]);
      if (!util.isNoU(r)) {
        value = r;
        matched++;
      }
    }
    outHtml += html.substr(currentIndex, result.index-currentIndex)+value;
    currentIndex = result.index+result[0].length;
  }
  if (matched > 0) {
    outHtml += html.substr(currentIndex);
    return outHtml;
  }
  return null;
};
/**
 * Gets the closest parent mathing the given query selector
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.getClosest
 * @param {Element} elem
 * @param {string} selector A valid DOM query selector string expression.
 * @return {Element|null}
 */
ZxQueryStatic.getClosest = function(elem, selector) {
  // Get closest match
  elem = elem.parentNode;
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(selector)) return elem;
  }
  return null;
};
/**
 * Gets the position of an element.
 *
 * @memberOf {ZxQueryStatic}
 * @alias zuix.$.getPosition
 * @param {Element} el
 * @param {number} [tolerance] Distance from viewport's boundaries for the element to be considered 'visible' (this is mainly used for lazy-loading).
 * @return {ElementPosition}
 */
ZxQueryStatic.getPosition = function(el, tolerance) {
  const visibleClass = '--ui--visible';
  const position = (function() {
    let x = 0;
    let y = 0;
    const rect = el.getBoundingClientRect();
    let parent = el;
    while (parent) {
      if (parent.tagName.toLowerCase() === 'body') {
        // deal with browser quirks with body/window/document and page scroll
        const scrollX = parent.scrollLeft || document.documentElement.scrollLeft;
        const scrollY = parent.scrollTop || document.documentElement.scrollTop;
        x += (parent.offsetLeft - scrollX + parent.clientLeft);
        y += (parent.offsetTop - scrollY + parent.clientTop);
      } else {
        // for all other non-BODY elements
        x += (parent.offsetLeft - parent.scrollLeft + parent.clientLeft);
        y += (parent.offsetTop - parent.scrollTop + parent.clientTop);
      }
      parent = parent.offsetParent;
    }
    return {
      x: x,
      y: y,
      rect: rect
    };
  })(el);
  position.visible = false;
  let scrollable = el.offsetParent;
  if (scrollable != null) {
    if (scrollable !== document.body) {
      // find the scrollable container
      let s = scrollable.offsetParent;
      while (s != null && s.offsetParent !== null && s.offsetHeight === s.scrollHeight) {
        s = s.offsetParent;
      }
      if (s != null) scrollable = s;
    }
    let r1 = scrollable.getBoundingClientRect();
    if (scrollable === document.body) {
      // modify from read-only object
      r1 = {
        x: r1.x,
        y: r1.y,
        width: document.documentElement.offsetWidth || document.documentElement.clientWidth,
        height: document.documentElement.offsetHeight || document.documentElement.clientHeight,
        top: 0,
        left: 0,
        right: document.documentElement.clientWidth || document.documentElement.offsetWidth,
        bottom: document.documentElement.clientHeight || document.documentElement.offsetHeight
      };
    }
    if (tolerance == null) tolerance = 0;
    const r2 = el.getBoundingClientRect();
    // visible status
    const visible = !(r2.left-1 > r1.right - tolerance ||
            r2.right+1 < r1.left + tolerance ||
            r2.top-1 > r1.bottom - tolerance ||
            r2.bottom+1 < r1.top + tolerance);
    position.visible = visible;
    // viewport-relative frame position
    position.frame = {
      dx: (r2.left + (r2.width / 2) - r1.left) / r1.width,
      dy: (r2.top + (r2.height / 2) - r1.top) / r1.height
    };
    // update status event and and/remove 'visibleClass'
    el = z$(el);
    if (!visible && el.hasClass(visibleClass)) {
      el.removeClass(visibleClass);
      position.event = 'exit';
    } else if (!visible) {
      position.event = 'off-scroll';
    } else if (visible) {
      if (!el.hasClass(visibleClass)) {
        position.event = 'enter';
        el.addClass(visibleClass);
      } else position.event = 'scroll';
    }
  }
  return position;
};

ZxQueryStatic.ZxQuery = ZxQuery;

// Element.matches() polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          const matches = (this.document || this.ownerDocument).querySelectorAll(s);
          let i = matches.length;
          while (--i >= 0 && matches.item(i) !== this) {
          }
          return i > -1;
        };
}
// window.CustomEvent polyfill for IE>=9
(function() {
  if (typeof window.CustomEvent === 'function') return false;
  function CustomEvent(event, params) {
    params = params || {bubbles: false, cancelable: false, detail: undefined};
    const evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();
// String.hashCode extension
String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
// String.startsWith polyfill
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}

/** @type {ZxQueryStatic} */
module.exports = z$;


/***/ }),

/***/ 693:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable */
/*!
 * @license
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 *
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

/* global define */



// TODO: detect whether running in a browser environment or not
(function(root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return (root.zuix = (factory).call(root));
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, __webpack_require__(459)));


/***/ }),

/***/ 265:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



const ObservableListener =
    __webpack_require__(463);
const ObservableObject =
    __webpack_require__(349);

/**
 * Object Observer
 *
 * @class ObjectObserver
 * @constructor
 */
function ObjectObserver() {
  /**
     * @private
     * @type {ObservableObject[]}
     */
  this.observableList = [];
}

function getPath(observable) {
  let path = '';
  while (observable && observable.__path__) {
    const co = observable;
    // TODO: this line is perhaps ambiguous how to resolve path if target[key] has more parents?
    observable = observable.__parents__[0];
    if (observable != null && observable.__path__ != null) {
      path = '[\'' + co.__path__ + '\'].' + path;
    } else {
      path = co.__path__ + (!path.startsWith('[') ? '.' : '') + path;
    }
  }
  return path;
}
function getListeners(observable) {
  const listeners = [];
  observable.__parents__.forEach(function(po) {
    listeners.push(...getListeners(po));
  });
  listeners.push(...observable.__listeners__);
  return listeners;
};

function deleteObservable(targetObservable) {
  getListeners(targetObservable).forEach(
      /** @param {ObservableListener} l */
      function(l) {
        targetObservable.unsubscribe(l);
      }
  );
}

/**
 * Get an observable instance of an object for detecting changes.
 *
 * @param {Object} obj The object to observe
 * @return {ObservableObject} The observable object
 */
ObjectObserver.prototype.observable = function(obj) {
  const _t = this;
  /** @type {ObservableObject} */
  let observable;
  const matches = this.observableList.filter(function(o) {
    return obj === o.proxy || obj === o.target;
  });
  if (matches.length === 1) {
    observable = matches[0];
  }
  if (observable == null) {
    const handler = {
      /** @type ObjectObserver */
      context: null,
      get: function(target, key) {
        if (key === 'observableTarget') return target;
        let value = target[key];
        if (typeof value === 'undefined') {
          return;
        }
        /** @type {ObservableListener[]} */
        const listeners = [];
        const targetObservable = this.context.observable(target);
        if (typeof value === 'object') {
          /** @type {ObservableObject} */
          const valueObservable = this.context.observable(value);
          // link to parent
          if (valueObservable.__parents__.indexOf(targetObservable) === -1) {
            valueObservable.__parents__.push(targetObservable);
            valueObservable.__path__ = key;
          }
          listeners.push(...getListeners(valueObservable));
          // set the return value to the observable value proxy (child)
          value = valueObservable.proxy;
        } else {
          listeners.push(...getListeners(targetObservable));
        }
        const path = getPath(targetObservable) + key;
        // propagate to all listeners
        listeners.forEach(function(l) {
          l.get(target, key, value, path);
        });
        return value;
      },
      set: function(target, key, value) {
        const old = JSON.parse(JSON.stringify(target));
        const oldValue = target[key];
        if (typeof oldValue === 'object') {
          deleteObservable(this.context.observable(oldValue));
        }
        target[key] = value;
        const targetObservable = this.context.observable(target);
        const path = getPath(targetObservable) + key;
        getListeners(targetObservable).forEach(
            /** @param {ObservableListener} l */
            function(l) {
              l.set(target, key, value, path, old);
            }
        );
        return true;
      },
      deleteProperty: function(target, property) {
        const value = target[property];
        if (typeof value === 'object') {
          deleteObservable(this.context.observable(value));
        }
        return delete target[property];
      }
    };
    observable = new ObservableObject(this, obj, handler);
  }
  return observable;
};
module.exports = ObjectObserver;


/***/ }),

/***/ 463:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



/**
 * ObservableListener interface.
 *
 * @class ObservableListener
 * @constructor
 */
function ObservableListener() {}

/**
 * This method does...
 *
 * @param {Object} target The updated object
 * @param {string} key The property key
 * @param {Object} value The value
 * @param {string} path Full property path
 * @returns undefined
 */
ObservableListener.prototype.get = function(target, key, value, path) {};

/**
 * This method does...
 *
 * @param {Object} target The updated object
 * @param {string} key The property key
 * @param {Object} value The value
 * @param {string} path Full property path
 * @param {Object} old A copy of the object before the update
 * @returns undefined
 */
ObservableListener.prototype.set = function(target, key, value, path, old) {};

module.export = ObservableListener;


/***/ }),

/***/ 349:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



const ObservableListener =
    __webpack_require__(463);

/**
 * ObservableObject class.
 *
 * @class ObservableObject
 * @param {Object} context The observer context
 * @param {Object} target The target object to observe
 * @param {ProxyHandler} handler Handler for get/set callbacks
 * @constructor
 */
function ObservableObject(context, target, handler) {
  Object.assign(handler, {context: context});
  Object.assign(this, Proxy.revocable(target, handler));
  /** @private */
  this.handler = handler;
  /** @private */
  this.handler.context.observableList = this.handler.context.observableList || [];
  this.handler.context.observableList.push(this);
  /** @private */
  this.target = target;
  /** @private */
  this.__parents__ = [];
  /** @private */
  this.__listeners__ = [];
}

/**
 * Subscribe a listener to this observable events
 *
 * @param {ObservableListener} observableListener
 * @returns ObservableObject
 */
ObservableObject.prototype.subscribe = function(observableListener) {
  const _t = this;
  this.handler.context.observableList.forEach(function(p) {
    if (p !== _t && p.__listeners__.indexOf(observableListener) !== -1) {
      throw new Error('Listener already registered.');
    }
  });
  this.__listeners__.push(observableListener);
  return this;
};

/**
 * Unsubscribe a listener
 *
 * @param {ObservableListener} observableListener
 * @returns ObservableObject
 */
ObservableObject.prototype.unsubscribe = function(observableListener) {
  const i = this.__listeners__.indexOf(observableListener);
  if (i !== -1) {
    this.__listeners__.splice(i, 1);
  }
  if (this.__listeners__.length === 0) {
    // this observable has no more direct listeners and can be removed
    this.revoke();
    // TODO: this is untested!!!
    // remove this observable and parent references to it
    const _t = this;
    this.handler.context.observableList = this.handler.context.observableList.filter(function(p) {
      if (p === _t) return false;
      const i = p.__parents__.indexOf(_t);
      if (i !== -1) {
        p.__parents__.splice(i, 1);
        // if child has no more parents nor listeners, then remove it as well
        if (p.__parents__.length === 0 && p.__listeners__.length === 0) {
          // recursive call
          p.unsubscribe(null);
          return false;
        }
      }
      return true;
    });
  }
  return this;
};

module.exports = ObservableObject;


/***/ }),

/***/ 854:
/***/ ((module) => {

/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

/**
 * Component cache object interface.
 *
 * @typedef {object} ComponentCache
 * @property {string} componentId The id of the cached component.
 * @property {Element} view The view element.
 * @property {string} css The CSS style text.
 * @property {boolean} css_applied Whether the CSS style has been applied to the view or not.
 * @property {ContextControllerHandler} controller The controller handler function.
 * @property {string} using The url/path if this is a resource loaded with `zuix.using(..)` method.
 */

/**
 * Bundle item object.
 *
 * @typedef {object} BundleItem
 * @property {Element} view
 * @property {string} css
 * @property {ContextControllerHandler} controller
 */

/** */
module.exports = function(root) {
  // dummy module for JsDocs/Closure Compiler
  return null;
};


/***/ }),

/***/ 622:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



const _log =
    __webpack_require__(381)('ComponentContext.js');
const _optionAttributes =
    __webpack_require__(541);
const z$ =
    __webpack_require__(917);
const util =
    __webpack_require__(826);
const ViewObserver =
    __webpack_require__(643);

// Custom objects definition used to generate JsDoc

/**
 * This function is called after the component is loaded
 * and it is used to initialize its controller.
 *
 * @callback ContextControllerHandler
 * @param {ContextController} cp The component controller object.
 * @this {ContextController}
 */

/**
 * Callback function triggered when an event registered with the `on` method occurs.
 *
 * @callback EventCallback
 * @param {string} event Event name.
 * @param {Object} data Event data.
 * @param {ZxQuery} $el ZxQuery wrapped element that sourced the event (same as `this`).
 * @this {ZxQuery}
 */

// private 'static' fields and methods

/** @type {Zuix} **/
let zuix = null;

const _controllerOnlyAttribute = '_ctrl_';
const _cssIdAttribute = '_css_';

const _componentIndex = [];
function getComponentIndex(context) {
  return _componentIndex[context.componentId];
}

/**
 * Bind provided data by automatically mapping it to the given element.
 *
 * @param {Element} el The element to bind data to.
 * @param {Object} boundData Data object to map data from.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
function dataBind(el, boundData) {
  boundData = boundData.observableTarget || boundData;
  // try to guess target property
  switch (el.tagName.toLowerCase()) {
    // TODO: complete binding cases
    case 'img':
      el.src = (!util.isNoU(boundData.src) ? boundData.src :
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      if (boundData.alt) el.alt = boundData.alt;
      break;
    case 'a':
      el.href = (!util.isNoU(boundData.href) ? boundData.getAttribute('href'):
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      if (boundData.title) el.title = boundData.title;
      if (!util.isNoU(boundData.href) && !util.isNoU(boundData.innerHTML) && boundData.innerHTML.trim() !== '') {
        el.innerHTML = boundData.innerHTML;
      }
      break;
    case 'input':
      el.value = (!util.isNoU(boundData.value) ? boundData.value :
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      break;
    default:
      el.innerHTML = (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData);
      if (boundData.attributes != null) {
        for (let i = 0; i < boundData.attributes.length; i++) {
          const attr = boundData.attributes[i];
          if (attr.specified && attr.name !== _optionAttributes.dataUiField) {
            if (attr.value[0] === '+' && el.hasAttribute(attr.name)) {
              attr.value = el.getAttribute(attr.name) + ' ' + attr.value.substring(1);
            }
            util.dom.setAttribute(el, attr.name, attr.value);
          }
        }
      }
  }
}

/**
 * The component context object.
 *
 * @param {Zuix} zuixInstance
 * @param {ContextOptions} options The context options.
 * @param {function} [eventCallback] Event routing callback.
 * @return {ComponentContext} The component context instance.
 * @constructor
 */
function ComponentContext(zuixInstance, options, eventCallback) {
  zuix = zuixInstance;
  this._options = null;
  this.contextId = (options == null || options.contextId == null) ? null : options.contextId;
  this.componentId = null;
  this.trigger = function(context, eventPath, eventValue) {
    if (typeof eventCallback === 'function') {
      eventCallback(context, eventPath, eventValue);
    }
  };

  /** @protected */
  this._container = null;

  /** @protected */
  this._model = null;
  /** @protected */
  this._view = null;
  /** @protected */
  this._css = null;
  /** @protected */
  this._style = null;
  /**
     * @protected
     * @type {ContextControllerHandler}
     */
  this._controller = null;

  /**
     * Define the local behavior handler for this context instance only.
     * Any global behavior matching the same `componentId` will be overridden.
     *
     * @function behavior
     * @param handler_fn {function}
     */
  this.behavior = null;

  /** @package */
  this._eventMap = [];
  /** @package */
  this._behaviorMap = [];

  /**
     * @protected
     * @type {ContextController}
     */
  this._c = null;

  /**
     * @protected
     * @type {ObservableListener}
     */
  this._modelListener = Object.assign({
    /** @type {ComponentContext} */
    context: null,
    get: function(target, key, value, path) {
      // TODO: maybe implement a {ContextController} callback for this too
    },
    set: function(target, key, value, path, old) {
      if (target instanceof Element) {
        //  use the first part of the "path" as field name (eg. 'text.innerHTML' --> 'text')
        //  for binding data to view element
        path = path.split('.')[0];
        value = target;
      }
      // update bound field if found in the view
      const view = z$(this.context.view());
      if (view.get()) {
        let fld = view.find(util.dom.queryAttribute(_optionAttributes.dataBindTo, path));
        if (fld.get() == null) {
          fld = view.find(util.dom.queryAttribute(_optionAttributes.dataUiField, path));
        }
        if (fld.get()) {
          dataBind(fld.get(), value);
        }
        // call controller's 'update' method
        if (this.context._c && typeof this.context._c.update === 'function') {
          this.context._c.update(target, key, value, path, old);
        }
      }
    }
  }, {context: this});

  /**
     * @type {ViewObserver}
     * @private
     */
  this._viewObserver = new ViewObserver(this);

  this.options(options);

  return this;
}

ComponentContext.prototype.dispose = function() {
  // TODO: ... check out for more resources that could be freed
  this._viewObserver.stop();
  if (!util.isNoU(this._c)) {
    if (!util.isNoU(this._c.view())) {
      // TODO: restore all attributes state to the original state (before component creation)
      this._c.view().attr(_optionAttributes.dataUiComponent, null);
      // un-register event handlers associated to the view
      this._c.view().reset();
      // un-register event handlers for all cached fields accessed through cp.field(...) method
      if (!util.isNoU(this._c._fieldCache)) {
        z$.each(this._c._fieldCache, /** @param {ZxQuery} v */ function(k, v) {
          v.reset();
        });
      }
    }
    if (util.isFunction(this._c.destroy)) {
      this._c.destroy.call(this, this);
    }
  }
  // un-register model observable
  this.model(null);
  // detach from parent
  this._c.view().detach();
  // detach the container from the DOM as well
  const cel = this._container;
  if (cel != null && cel.parentNode != null) {
    cel.parentNode.removeChild(cel);
  }
};

/**
 * Gets/Sets the container element of the component.
 * Returns the current container element if no
 * argument is passed, the {ComponentContext} itself
 * otherwise.
 *
 * @param {Element} [container] The container element.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.container = function(container) {
  // TODO: should automatically re-attach view to the new parent?
  if (container == null) return this._container;
  else if (container instanceof z$.ZxQuery) {
    container = container.get();
  }
  this._container = container;
  return this;
};

/**
 * Gets/Sets the view element of the component.
 * If an *HTML* string is passed, then the view element
 * will be a new `div` wrapping the given markup.
 * Returns the current view element if no
 * argument is passed, the {ComponentContext} itself otherwise.
 *
 * @param {Element|string|undefined} [view] The *HTML* string or element of the view.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.view = function(view) {
  if (typeof view === 'undefined') {
    return this._view;
  } else if (view === null) {
    // TODO: add more consistency check on methods parameters in the whole library
    throw new Error('View cannot be set to null.');
  } else if (view instanceof z$.ZxQuery) {
    view = view.get();
  }
  if (view === this._view) return this;
  this._viewObserver.stop();

  // clean custom attributes added to the old view
  const cssId = this.getCssId();
  if (this._view != null) {
    // view style encapsulation
    const q = '*' +
            util.dom.cssNot(_optionAttributes.dataUiLoad).getAll() +
            util.dom.cssNot(_optionAttributes.dataUiInclude).getAll();
    // mark all elements with a css identifier attribute
    z$(this._view).attr(cssId, null).find(q).each(function(i, v) {
      this.attr(cssId, null);
    });
  }

  _log.t(this.componentId, 'view:attach', 'timer:view:start');
  if (typeof view === 'string') {
    // load view from HTML source

    // trigger `html:parse` hook before assigning content to the view
    const hookData = {content: view};
    this.trigger(this, 'html:parse', hookData);
    view = hookData.content;

    const viewDiv = z$.wrapElement('div', view);
    if (viewDiv.firstElementChild != null) {
      // remove data-ui-view attribute from template if present on root node
      if (util.dom.getAttribute(viewDiv.firstElementChild, _optionAttributes.dataUiView) != null) {
        if (viewDiv.children.length === 1) {
          view = viewDiv.firstElementChild.innerHTML;
        }
      } else view = viewDiv.innerHTML;
    }
    if (this._container != null) {
      // append view content to the container
      this._view = this._container;
      this._view.innerHTML += view;
    } else {
      if (this._view != null) {
        this._view.innerHTML = view;
      } else this._view = viewDiv;
    }

    const v = z$(this._view);
    // Run embedded scripts
    v.find('script').each(function(i, el) {
      if (this.attr(_optionAttributes.zuixLoaded) !== 'true') {
        this.attr(_optionAttributes.zuixLoaded, 'true');
        /* if (el.src != null && el.src.length > 0) {
                    var clonedScript = document.createElement('script');
                    setAttribute(clonedScript, _optionAttributes.zuixLoaded, 'true');
                    clonedScript.onload = function () {
                        // TODO: ...
                    };
                    if (!util.isNoU(this.type) && this.type.length > 0)
                        clonedScript.type = this.type;
                    if (!util.isNoU(this.text) && this.text.length > 0)
                        clonedScript.text = this.text;
                    if (!util.isNoU(this.src) && this.src.length > 0)
                        clonedScript.src = this.src;
                    this.get().parentNode.insertBefore(clonedScript, this.get());
                } else */
        (eval).call(window, el.innerHTML);
      }
    });

    // trigger `view:process` hook when the view is ready to be processed
    this.trigger(this, 'view:process', z$(this._view));
  } else {
    // load inline view
    if (this._container != null) {
      this._view = z$.wrapElement('div', view.outerHTML).firstElementChild;
      // remove data-ui-view attribute if present on root node
      util.dom.setAttribute(this._view, _optionAttributes.dataUiView, null);
      this._container.appendChild(this._view);
      this._view = this._container;
    } else this._view = view;
  }

  const v = z$(this._view);

  // Disable loading of nested components until the component is ready
  v.find(util.dom.queryAttribute(_optionAttributes.dataUiLoad)).each(function(i, v) {
    this.attr(_optionAttributes.dataUiLoaded, 'false');
  });

  // View style encapsulation
  if (this._options.css !== false) {
    v.attr(cssId, ''); // this will also tell when multiple controllers are handling the same view
    // if both the container and the style are null
    // then this is just a controller attached to a pre-existent view
    if (this._container != null || this._style != null) {
      // view style encapsulation
      const q = '*' +
                util.dom.cssNot(_optionAttributes.dataUiLoad).getAll() +
                util.dom.cssNot(_optionAttributes.dataUiInclude).getAll();
      // mark all elements with a css identifier attribute
      v.find(q).each(function(i, v) {
        this.attr(cssId, '');
      });
      // start view observer for dynamically adding the css identifier
      // attribute to elements added after view creation
      this._viewObserver.start();
      // since this is a component, remove the 'controller only' flag
      v.attr(_controllerOnlyAttribute, null);
    } else {
      // this is a controller only instance, add the 'controller only' flag
      // so that this instance view will inherit styles from the parent component
      v.attr(_controllerOnlyAttribute, '');
    }
  }

  this.modelToView();

  _log.t(this.componentId, 'view:attach', 'timer:view:stop');
  return this;
};

/**
 * Gets/Sets the view style of the component.
 * The `css` argument can be a string containing all
 * styles definitions or a reference to a style
 * element. When a string is passed the css
 * is linked to the `componentId` attribute so that
 * its styles will be only applied to the component
 * container.
 * If no argument is given, then the current style
 * element is returned.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.style("p { font-size: 120%; } .hidden { display: 'none'; }");
 * </code></pre>
 *
 * @param {string|Element|undefined} [css] The CSS string or element.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.style = function(css) {
  if (typeof css === 'undefined') return this._style;
  _log.t(this.componentId, 'view:style', 'timer:view:start');
  if (css == null || css instanceof Element) {
    this._css = (css instanceof Element) ? css.innerText : css;
    this._style = z$.appendCss(css, this._style, this.componentId);
  } else if (typeof css === 'string') {
    // store original unparsed css (might be useful for debugging)
    this._css = css;

    // trigger `css:parse` hook before assigning content to the view
    const hookData = {content: css};
    this.trigger(this, 'css:parse', hookData);
    css = hookData.content;

    // reset css
    let resetCss = '';
    if (this.options().resetCss === true) {
      // from https://jgthms.com/minireset.css/
      resetCss = /* html,body, */ 'p,ol,ul,li,dl,dt,dd,blockquote,figure,fieldset,legend,textarea,pre,iframe,hr,h1,h2,h3,h4,h5,h6{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal}ul{list-style:none}button,input,select,textarea{margin:0}html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}img,video{height:auto;max-width:100%}iframe{border:0}table{border-collapse:collapse;border-spacing:0}td,th{padding:0;text-align:left}';
    }

    // nest the CSS inside [data-ui-component='<componentId>']
    // so that the style is only applied to this component type
    const cssIdAttr = '[' + this.getCssId() + ']';
    css = z$.wrapCss(
        cssIdAttr,
        resetCss + '\n' + css,
        this.options().encapsulation === true
    );

    // output css
    this._style = z$.appendCss(css, this._style, this.componentId);
  }
  // TODO: should throw error if ```css``` is not a valid type
  _log.t(this.componentId, 'view:style', 'timer:view:stop');
  return this;
};
/**
 * Gets/Sets the data model of the component.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.model({
 *      title: 'Thoughts',
 *      message: 'She stared through the window at the stars.'
 *  });
 * </code></pre>
 *
 * @param {object|undefined} [model] The model object.
 * @return {ComponentContext|object}
 */
ComponentContext.prototype.model = function(model) {
  if (typeof model === 'undefined') return this._model;
  else if (this._model === model) return this;
  // unsubscribe previous model observable
  if (this._model !== null && typeof this._model !== 'function') {
    zuix.observable(this._model)
        .unsubscribe(this._modelListener);
  }
  this._model = model;
  if (model != null) {
    // subscribe to new model observable
    if (typeof model !== 'function') {
      this._model = zuix.observable(model)
          .subscribe(this._modelListener)
          .proxy;
    }
    this.modelToView();
    // call controller `update` method when whole model is updated
    if (this._c != null && util.isFunction(this._c.update)) {
      this._c.update.call(this._c, null, null, null, null, this._c);
    }
  }
  return this;
};
/**
 * Gets/Sets the handler function of the controller.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.controller(function(cp) {
 *      cp.create = function() {
 *           cp.view().html('Hello World!');
 *      };
 *      // ...
 *  });
 * </code></pre>
 *
 * @param {ContextControllerHandler|undefined} [controller] The handler function of the controller.
 * @return {ComponentContext|ContextControllerHandler}
 */
ComponentContext.prototype.controller = function(controller) {
  if (typeof controller === 'undefined') return this._controller;
  // TODO: should dispose previous context controller first,
  // TODO: alternatively should not allow _controller reassignment and throw an error
  else this._controller = controller; // can be null
  return this;
};

/**
 * Gets/Sets the component options.
 *
 * @param {ContextOptions|undefined} options The JSON options object.
 * @return {ComponentContext|object}
 */
ComponentContext.prototype.options = function(options) {
  if (options == null) {
    return this._options;
  }
  const o = this._options = this._options || {};
  Object.assign(o, options);
  this.componentId = o.componentId || this.componentId;
  // store index for this component type if not already in
  if (_componentIndex[this.componentId] == null) {
    _componentIndex[this.componentId] = _componentIndex.length;
    _componentIndex.length++;
  }
  this.container(o.container);
  this.view(o.view);
  if (typeof o.css !== 'undefined') {
    this.style(o.css);
  }
  this.controller(o.controller);
  this.model(o.model);
  return this;
};

/**
 * Listens for a component event.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.on('item:share', function(evt, data) { ... });
 * </code></pre>
 *
 * @param {string} eventPath The event path.
 * @param {EventCallback} eventHandler The event handling function.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.on = function(eventPath, eventHandler) {
  // TODO: throw error if _c (controller instance) is not yet ready
  this._c.on(eventPath, eventHandler);
  return this;
};
/**
 * Loads the `.css` file and replace the view style of the component.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.css' by default
 * ctx.loadCss();
 * // or loads the view css with options
 * ctx.loadCss({
 *     path: 'url/of/style/file.css',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @private
 * @param {object} [options] The options object.
 * @param {boolean} [enableCaching] Enable HTTP
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.loadCss = function(options, enableCaching) {
  const context = this;
  if (util.isNoU(options)) options = {};
  if (!util.isNoU(options.caching)) {
    enableCaching = options.caching;
  }
  let cssPath = context.componentId + '.css';
  if (!util.isNoU(options.path)) {
    cssPath = options.path;
  }
  if (!enableCaching) {
    cssPath += '?'+new Date().getTime();
  }
  z$.ajax({
    url: zuix.getResourcePath(cssPath),
    success: function(viewCss) {
      context.style(viewCss);
      if (util.isFunction(options.success)) {
        (options.success).call(context, viewCss, context);
      }
    },
    error: function(err) {
      _log.e(err, context);
      if (util.isFunction(options.error)) {
        (options.error).call(context, err, context);
      }
    },
    then: function() {
      if (util.isFunction(options.then)) {
        (options.then).call(context, context);
      }
    }
  });
  return this;
};
/**
 * Loads the `.html` file and replace the view markup code of the component.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.html' by default
 * ctx.loadHtml();
 * // or loads the view html with options
 * ctx.loadHtml({
 *     path: 'url/of/view/file.html',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @private
 * @param {object} [options] The options object.
 * @param {boolean} [enableCaching] Enable HTTP caching
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.loadHtml = function(options, enableCaching) {
  const context = this;
  let htmlPath = context.componentId;
  if (util.isNoU(options)) options = {};
  if (!util.isNoU(options.caching)) {
    enableCaching = options.caching;
  }
  if (!util.isNoU(options.path)) {
    htmlPath = options.path;
  }
  // cache inline "data-ui-view" html
  let inlineViews = zuix.store('zuix.inlineViews');
  if (inlineViews == null) {
    inlineViews = [];
    zuix.store('zuix.inlineViews', inlineViews);
  }
  if (inlineViews[htmlPath] != null) {
    context.view(inlineViews[htmlPath]);
    if (util.isFunction(options.success)) {
      (options.success).call(context, inlineViews[htmlPath], context);
    }
    if (util.isFunction(options.then)) {
      (options.then).call(context, context);
    }
  } else {
    // TODO: check if view caching is working in this case too
    const inlineView = z$().find(util.dom.queryAttribute(
        _optionAttributes.dataUiView,
        htmlPath,
        util.dom.cssNot(_optionAttributes.dataUiComponent)
    ));
    if (inlineView.length() > 0) {
      const inlineElement = inlineView.get(0);
      inlineViews[htmlPath] = inlineElement.innerHTML;
      if (context.view() === inlineElement || (context.container() != null && context.container().contains(inlineElement))) {
        // TODO: test this case better (or finally integrate some unit testing =))
        // TODO: "html:parse" will not fire in this case (and this is the wanted behavior)
        inlineView.attr(_optionAttributes.dataUiView, null);
        context._view = inlineElement;
        // trigger `view:process` hook
        this.trigger(this, 'view:process', z$(context.view()));
      } else {
        context.view(inlineElement.innerHTML);
      }
      if (util.isFunction(options.success)) {
        (options.success).call(context, inlineElement.innerHTML, context);
      }
      if (util.isFunction(options.then)) {
        (options.then).call(context, context);
      }
    } else {
      const cext = util.isNoU(options.cext) ? '.html' : options.cext;
      if (htmlPath == context.componentId) {
        htmlPath += cext + (!enableCaching ? '?' + new Date().getTime() : '');
      }
      z$.ajax({
        url: zuix.getResourcePath(htmlPath),
        success: function(viewHtml) {
          context.view(viewHtml);
          if (util.isFunction(options.success)) {
            (options.success).call(context, viewHtml, context);
          }
        },
        error: function(err) {
          _log.e(err, context);
          if (util.isFunction(options.error)) {
            (options.error).call(context, err, context);
          }
        },
        then: function() {
          if (util.isFunction(options.then)) {
            (options.then).call(context, context);
          }
        }
      });
    }
  }
  return this;
};
/**
 * Creates the data model starting from ```data-ui-field```
 * elements declared in the component view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.viewToModel = function() {
  _log.t(this.componentId, 'view:model', 'timer:vm:start');
  const model = {};
  // create data model from inline view fields
  z$(this._view).find(util.dom.queryAttribute(_optionAttributes.dataUiField)).each(function(i, el) {
    // TODO: this is not so clean
    if (this.parent('pre,code').length() > 0) {
      return true;
    }
    const name = this.attr(_optionAttributes.dataUiField);
    const value =
            // TODO: this is a work around for IE where "el.innerHTML" is lost after view replacing
            (!util.isNoU(el.innerHTML) && util.isIE()) ?
                el.cloneNode(true) : el;
    // dotted field path
    if (name.indexOf('.')>0) {
      const path = name.split('.');
      let cur = model;
      for (let p = 0; p < path.length - 1; p++) {
        if (typeof cur[path[p]] === 'undefined') {
          cur[path[p]] = {};
        }
        cur = cur[path[p]];
      }
      cur[path[path.length - 1]] = value;
    } else model[name] = value;
  });
  this._model = zuix.observable(model)
      .subscribe(this._modelListener)
      .proxy;
  // TODO: should call this._c.update(....)
  _log.t(this.componentId, 'view:model', 'timer:vm:stop');
  return this;
};
/**
 * Copies values from the data model to the ```data-ui-field```
 * elements declared in the component view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.modelToView = function() {
  _log.t(this.componentId, 'model:view', 'timer:mv:start');
  if (this._view != null && this._model != null) {
    const _t = this;
    z$(this._view).find(util.dom.queryAttribute(_optionAttributes.dataUiField)).each(function(i, el) {
      if (this.parent('pre,code').length() > 0) {
        return true;
      }
      let boundField = this.attr(_optionAttributes.dataBindTo);
      if (boundField == null) {
        boundField = this.attr(_optionAttributes.dataUiField);
      }
      const v = z$(_t._view);
      if (typeof _t._model === 'function') {
        (_t._model).call(v, this, boundField, v);
      } else {
        const boundData = util.propertyFromPath(_t._model, boundField);
        if (typeof boundData === 'function') {
          (boundData).call(v, this, boundField, v);
        } else if (boundData != null) {
          dataBind(el, boundData);
        }
      }
    });
  }
  _log.t(this.componentId, 'model:view', 'timer:mv:stop');
  return this;
};

/**
 * Get the CSS identifier attribute.
 *
 * @return {string} The css-id attribute of this component
 */
ComponentContext.prototype.getCssId = function() {
  return _cssIdAttribute + getComponentIndex(this);
};

module.exports = ComponentContext;


/***/ }),

/***/ 211:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



const _optionAttributes =
    __webpack_require__(541);

const LIBRARY_PATH_DEFAULT = 'https://zuixjs.github.io/zkit/lib/'; // CORS works only over HTTPS

/**
 * TODO: describe this...
 *
 * @param {Element|ZxQuery|undefined} [element] Scan and process loadable elements inside `element`.
 * @param {Element|undefined} [child] Process only the specified `child` of `element`.
 * @return {Componentizer}
 */
Componentizer.prototype.componentize = function(element, child) {
  zuix.trigger(this, 'componentize:begin');
  if (child != null) {
    const cache = getElementCache(element);
    if (cache == null) {
      setElementCache(element, [child]);
    } else cache.push(child);
  } else {
    addRequest(element);
  }
  loadNext(element);
  return this;
};

Componentizer.prototype.applyOptions = function(element, options) {
  applyOptions(element, options);
  return this;
};

Componentizer.prototype.resolvePath = function(path) {
  return resolvePath(path);
};

/**
 *
 * @return {boolean}
 */
Componentizer.prototype.willLoadMore = function() {
  return _componentizeQueue.length > 0 || _componentizeRequests.length > 0;
};

/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Load-ahead threshold (default is 1.0 => 100% of view size).
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Componentizer.prototype.lazyLoad = function(enable, threshold) {
  return lazyLoad(enable, threshold);
};


Componentizer.prototype.dequeue = function(element) {
  for (let i = 0; i < _componentizeQueue.length; i++) {
    const item = _componentizeQueue[i];
    if (item.element === element) {
      _componentizeQueue.splice(i, 1);
      break;
    }
  }
};


/**
 *
 * @param {Zuix} zuixInstance
 * @return {Componentizer}
 */
Componentizer.prototype.setHost = function(zuixInstance) {
  zuix = zuixInstance;
  return this;
};

module.exports = function() {
  return new Componentizer();
};


// ---------------------------------------------


const _log =
    __webpack_require__(381)('ComponentContext.js');
const util =
    __webpack_require__(826);
const z$ =
    __webpack_require__(917);

/** @private */
const _componentizeRequests = [];
/** @private */
const _componentizeQueue = [];
/** @private */
const _lazyElements = [];
/** @private */
const _lazyContainers = [];

/** @private */
const TaskItem = function() {
  return {
    /** @typedef {Element} */
    element: null,
    /** @typedef {number} */
    priority: 0,
    /** @typedef {boolean} */
    visible: true,
    /** @typedef {boolean} */
    lazy: false
  };
};

// Components Loading Chain
const loader = __webpack_require__(246)({

  doWork: function(item, callback) {
    z$(item.element).one('component:ready', function() {
      callback();
    });
    return loadInline(item.element);
  },
  willBreak: function() {
    return false;
  },
  status: function(status) {
    switch (status) {
      case 'start':
        break;
      case 'done':
        loadNext();
        break;
    }
  }

});

/** @private */
let _disableLazyLoading = false;
/** @private */
let _lazyLoadingThreshold = 1;

/** @type {Zuix} **/
let zuix = null;

// Browser Agent / Bot detection
/** @private */
let _isCrawlerBotClient = false;
if (navigator && navigator.userAgent) {
  _isCrawlerBotClient = new RegExp(/bot|googlebot|crawler|spider|robot|crawling/i)
      .test(navigator.userAgent);
}
if (_isCrawlerBotClient) {
  _log.d(navigator.userAgent, 'is a bot, ignoring `lazy-loading` option.');
}

/**
 *
 * @class Componentizer
 * @constructor
 */
function Componentizer() {
  // ...
}
/**
 * Lazy Loading settings.
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Read ahead tolerance (default is 1.0 => 100% of view size).
 * @return {boolean}
 */
function lazyLoad(enable, threshold) {
  if (enable != null) {
    _disableLazyLoading = !enable;
  }
  if (threshold != null) {
    _lazyLoadingThreshold = threshold;
  }
  return !_isCrawlerBotClient && !_disableLazyLoading;
}
/** @private */
function addRequest(element) {
  if (element == null) {
    element = document;
  }
  if (!_componentizeRequests.indexOf(element)) {
    _componentizeRequests.push(element);
  }
}

const _elementCache = [];
/** @private */
function setElementCache(element, waiting) {
  _elementCache.push({
    element: element,
    waiting: waiting
  });
}
/** @private */
function getElementCache(element) {
  for (let i = 0; i < _elementCache.length; i++) {
    const cache = _elementCache[i];
    if (cache.element === element) {
      return cache.waiting;
    }
  }
  return null;
}

/** @private */
function queueLoadables(element) {
  if (element == null && _componentizeRequests.length > 0) {
    element = _componentizeRequests.unshift();
  }
  if (element instanceof z$.ZxQuery) {
    element = element.get();
  }
  // Select all loadable elements
  let waitingLoad = getElementCache(element);
  //    if (waitingLoad == null || waitingLoad.length == 0) {
  const q = util.dom.queryAttribute(_optionAttributes.dataUiLoad, null, util.dom.cssNot(_optionAttributes.dataUiLoaded)) + ',' +
        util.dom.queryAttribute(_optionAttributes.dataUiInclude, null, util.dom.cssNot(_optionAttributes.dataUiLoaded));
  waitingLoad = z$(element).find(q);
  waitingLoad = Array.prototype.slice.call(waitingLoad._selection);
  setElementCache(element, waitingLoad);
  //    }
  const waitingTasks = [];
  for (let w = 0; w < waitingLoad.length; w++) {
    const el = waitingLoad[w];
    let pri = +(util.dom.getAttribute(el, _optionAttributes.dataUiPriority));
    if (isNaN(pri)) pri = 0;
    // adjust priority by element level
    let level = 0;
    let parent = el.parentNode;
    let ignore = false;
    while (parent != null && parent !== document) {
      level++;
      if (util.dom.getAttribute(parent, _optionAttributes.dataUiView) != null) {
        ignore = true;
        break;
      }
      parent = parent.parentNode;
    }
    if (!ignore) {
      const task = new TaskItem();
      task.element = el;
      task.priority = pri + (level * 1000);
      waitingTasks.push(task);
    } else {
      // _log.w("Element belongs to a template: process only when attached to a context instance.", el);
    }
  }
  let added = 0;
  // add selected elements to the requests queue
  for (let i = 0; i < waitingTasks.length; i++) {
    let alreadyAdded = false;
    for (let j = 0; j < _componentizeQueue.length; j++) {
      if (waitingTasks[i].element === _componentizeQueue[j].element) {
        alreadyAdded = true;
        break;
      }
    }
    if (!alreadyAdded) {
      // Add attributes to element if data-ui-options was provided
      const el = waitingTasks[i].element;
      const options = util.dom.getAttribute(el, _optionAttributes.dataUiOptions);
      applyOptions(el, options);
      // Add task to the queue
      _componentizeQueue.push(waitingTasks[i]);
      added++;
    }
  }

  _log.t('componentize:count', _componentizeQueue.length, added);

  if (added === 0 || (_componentizeRequests.length === 0 && _componentizeQueue.length === 0)) {
    zuix.trigger(this, 'componentize:end');
  }
}

/** @private */
function getNextLoadable() {
  // sort by priority (elements with lower pri number get processed first)
  _componentizeQueue.sort(function(a, b) {
    return a.priority - b.priority;
  });
  let job = null;
  let item = _componentizeQueue.length > 0 ? _componentizeQueue.shift() : null;
  while (item != null && item.element != null) {
    // defer element loading if lazy loading is enabled and the element is not in view
    const isLazy = lazyElementCheck(item.element);
    if (lazyLoad() && isLazy) {
      item.lazy = true;
      item.visible = z$.getPosition(item.element, _lazyLoadingThreshold).visible;
    } else {
      item.lazy = false;
      item.visible = true;
    }
    if (item.element != null && item.visible) {
      job = {
        item: item,
        cancelable: item.lazy
      };
      break;
    }
    if (_componentizeQueue.length > 0) {
      item = _componentizeQueue.shift();
    } else break;
  }
  return job;
}

/** @private */
function loadNext(element) {
  queueLoadables(element);
  const job = getNextLoadable();
  if (job != null) {
    loader.append([job]);
  }
}

/** @protected */
function loadInline(element) {
  const v = z$(element);
  if (v.attr(_optionAttributes.dataUiLoaded) != null || v.parent('pre,code').length() > 0) {
    // _log.w("Skipped", element);
    return false;
  } else {
    v.attr(_optionAttributes.dataUiLoaded, 'true');
  }

  /** @type {ContextOptions} */
  let options = v.attr(_optionAttributes.dataUiOptions);
  if (!util.isNoU(options)) {
    if (typeof options === 'string') {
      if (options.trim().startsWith('{') && options.trim().endsWith('}')) {
        options = eval('var o = ' + options + '; o;');
      } else options = util.propertyFromPath(window, options);
    }
    // copy passed options
    options = util.cloneObject(options) || {};
  } else {
    options = {};
  }

  const contextId = v.attr(_optionAttributes.dataUiContext);
  if (!util.isNoU(contextId)) {
    // inherit options from context if already exists
    const ctx = zuix.context(contextId);
    if (ctx !== null) {
      options = ctx.options();
    }
    options.contextId = contextId;
  }

  // Automatic view/container selection
  if (util.isNoU(options.view) && !v.isEmpty()) {
    options.view = element;
    options.viewDeferred = true;
  } else if (util.isNoU(options.view) && util.isNoU(options.container) && v.isEmpty()) {
    options.container = element;
  }

  let componentId = v.attr(_optionAttributes.dataUiLoad);
  if (util.isNoU(componentId)) {
    const include = v.attr(_optionAttributes.dataUiInclude);
    if (include != null) {
      componentId = resolvePath(include);
      v.attr(_optionAttributes.dataUiInclude, componentId);
      v.attr(_optionAttributes.dataUiComponent, '');
      // Static include hove no controller
      if (util.isNoU(options.controller)) {
        options.controller = function() {};
      }
    } else {
      return false;
    }
  } else {
    componentId = resolvePath(componentId);
    v.attr(_optionAttributes.dataUiLoad, componentId);
  }

  // inline attributes have precedence over ```options```

  const model = v.attr(_optionAttributes.dataBindModel);
  if (!util.isNoU(model) && model.length > 0) {
    options.model = util.propertyFromPath(window, model);
  }

  const priority = v.attr(_optionAttributes.dataUiPriority);
  if (!util.isNoU(priority)) {
    options.priority = +(priority);
  }

  const el = z$(element);
  el.one('component:ready', function() {
    addRequest(element);
    loadNext(element);
  });

  zuix.load(componentId, options);

  return true;
}

/** @private */
function resolvePath(path) {
  if (path[0] === '@') {
    let config = zuix.store('config');
    let libraryPath = LIBRARY_PATH_DEFAULT;
    if (config != null && config[location.host] != null) {
      config = config[location.host];
    }
    if (config != null) {
      switch (typeof config.libraryPath) {
        case 'object':
          z$.each(config.libraryPath, function(k, v) {
            if (path.startsWith(k + '/')) {
              libraryPath = v;
              return false;
            }
            return true;
          });
          break;
        case 'string':
          libraryPath = config.libraryPath;
          break;
      }
    }
    path = libraryPath + path.substring(path.indexOf('/') + 1);
  }
  return path;
}

/** @private */
function applyOptions(element, options) {
  // TODO: add parseOptions method
  if (typeof options === 'string') {
    if (options.trim().startsWith('{') && options.trim().endsWith('}')) {
      options = eval('var o = ' + options + '; o;');
    } else options = util.propertyFromPath(window, options);
  }
  // TODO: should check if options object is valid
  if (element != null && options != null) {
    if (options.lazyLoad != null) {
      util.dom.setAttribute(element, _optionAttributes.dataUiLazyload, options.lazyLoad.toString().toLowerCase());
    }
    if (options.contextId != null) {
      util.dom.setAttribute(element, _optionAttributes.dataUiContext, options.contextId.toString().toLowerCase());
    }
    if (options.componentId != null) {
      util.dom.setAttribute(element, _optionAttributes.dataUiLoad, options.componentId.toString().toLowerCase());
    }
    // TODO: eventually map other attributes from options
  }
}

// ------------ Lazy Loading

/** @private */
function getLazyElement(el) {
  for (let l = 0; l < _lazyElements.length; l++) {
    const le = _lazyElements[l];
    if (le.element === el) {
      return le;
    }
  }
  return null;
}

/** @private */
function addLazyElement(el) {
  const le = {
    element: el
  };
  _lazyElements.push(le);
  return le;
}

/** @private */
function getLazyContainer(el) {
  for (let l = 0; l < _lazyContainers.length; l++) {
    const ls = _lazyContainers[l];
    if (ls.element === el) {
      return ls;
    }
  }
  return null;
}

/** @private */
function addLazyContainer(el) {
  const lc = {
    element: el
  };
  _lazyContainers.push(lc);
  return lc;
}

/** @private */
function lazyElementCheck(element) {
  // Check if element has explicit lazyLoad=false flag set
  if (util.dom.getAttribute(element, _optionAttributes.dataUiLazyload) === 'false') {
    return false;
  }
  // Check if element is already added to Lazy-Element list
  let le = getLazyElement(element);
  if (le == null) {
    // Check if element inherits lazy-loading from a parent lazy container/scroll
    const q = util.dom.queryAttribute(_optionAttributes.dataUiLazyload, 'scroll') + ',' +
            util.dom.queryAttribute(_optionAttributes.dataUiLazyload, 'true');
    const lazyContainer = z$.getClosest(element.parentNode, q);
    if (lazyContainer != null) {
      le = addLazyElement(element);
      // Check if the lazy container is already added to the lazy container list
      let lc = getLazyContainer(lazyContainer);
      if (lc == null) {
        lc = addLazyContainer(lazyContainer);
        // if it's of type 'scroll' attach 'scroll' event handler
        if (util.dom.getAttribute(lazyContainer, _optionAttributes.dataUiLazyload) === 'scroll') {
          (function(instance, lc) {
            let lastScroll = new Date().getTime();
            z$(lc === document.body ? window : lc).on('scroll', function() {
              const now = new Date().getTime();
              if (now - lastScroll > 100) {
                lastScroll = now;
                loadNext(lc);
              }
            });
          })(this, lazyContainer);
        }
      }
      return true;
    } else if (util.dom.getAttribute(element, _optionAttributes.dataUiLazyload) === 'true') {
      // element has explicit lazyLoad=true flag set
      le = addLazyElement(element);
      return true;
    }
  } else return true;
  return false;
}


/***/ }),

/***/ 561:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



const z$ =
    __webpack_require__(917);

/**
 * Function called when the data model of the component is updated
 *
 * @callback ContextControllerUpdateCallback
 * @param {Object} target The target object.
 * @param {string} key The name of the property.
 * @param {Object} value The value of the property.
 * @param {string} path The full property path (dotted notation).
 * @param {Object} old The target object before the update.
 * @return undefined
 */

/**
 * Function that gets called after loading and before the component is created.
 *
 * @callback ContextControllerInitCallback
 */

/**
 * Function that gets called after loading, when the component is actually created and ready.
 *
 * @callback ContextControllerCreateCallback
 */

/**
 * Function called when the component is destroyed.
 *
 * @callback ContextControllerDestroyCallback
 */

/**
 * ContextController constructor.
 *
 * @param {ComponentContext} context
 * @return {ContextController}
 * @constructor
 */
function ContextController(context) {
  const _t = this;

  this._view = null;

  this.context = context;

  /**
     * @package
     * @type {!Array.<ZxQuery>}
     **/
  this._fieldCache = [];

  /**
     * @protected
     * @type {!Array.<Element>}
     * */
  this._childNodes = [];
  /** @type {function} */
  this.saveView = function() {
    this.restoreView();
    this.view().children().each(function(i, el) {
      _t._childNodes.push(el);
    });
  };
  this.restoreView = function() {
    if (this._childNodes.length > 0) {
      _t.view().html('');
      z$.each(_t._childNodes, function(i, el) {
        _t.view().append(el);
      });
      this._childNodes.length = 0;
    }
  };

  this.on = function(eventPath, handler) {
    this.addEvent(eventPath, handler);
    return this;
  };
  /** @protected */
  this.mapEvent = function(eventMap, target, eventPath, handler) {
    if (target != null) {
      target.off(eventPath, this.eventRouter);
      eventMap[eventPath] = handler;
      target.on(eventPath, this.eventRouter);
    } else {
      // TODO: should report missing target
    }
  };
  /** @protected */
  this.eventRouter = function(e) {
    const v = _t.view();
    if (typeof context._behaviorMap[e.type] === 'function') {
      context._behaviorMap[e.type].call(v, e, e.detail, v);
    }
    if (typeof context._eventMap[e.type] === 'function') {
      context._eventMap[e.type].call(v, e, e.detail, v);
    }
    // TODO: else-> should report anomaly
  };

  // create event map from context options
  const options = context.options();
  let handler = null;
  if (options.on != null) {
    for (const ep in options.on) {
      if (options.on.hasOwnProperty(ep)) {
        handler = options.on[ep];
        _t.addEvent(ep, handler);
      }
    }
  }
  // create behavior map from context options
  if (options.behavior != null) {
    for (const bp in options.behavior) {
      if (options.behavior.hasOwnProperty(bp)) {
        handler = options.behavior[bp];
        _t.addBehavior(bp, handler);
      }
    }
  }

  context.controller().call(this, this);

  return this;
}

/**
 * @description If set, this function gets called before component is created and before applying context options.
 * @type {ContextControllerInitCallback}
 */
ContextController.prototype.init = null;
/**
 * @description If set, this function gets called after loading, when the component is created and its view (if provided) is loaded.
 * @type {ContextControllerCreateCallback}
 **/
ContextController.prototype.create = null;
/**
 * @description If set, this function gets called when the component is destroyed.
 * @type {ContextControllerUpdateCallback}
 **/
ContextController.prototype.update = null;
/**
 * @description If set, this function gets called each time the data model is updated.
 * @type {ContextControllerDestroyCallback}
 **/
ContextController.prototype.destroy = null;

// TODO: add jsDoc
ContextController.prototype.addEvent = function(eventPath, handler) {
  this.mapEvent(this.context._eventMap, this.view(), eventPath, handler);
  return this;
};

// TODO: add jsDoc
ContextController.prototype.addBehavior = function(eventPath, handler) {
  this.mapEvent(this.context._behaviorMap, this.view(), eventPath, handler);
  return this;
};

/**
 * Gets elements in the component view with `data-ui-field`
 * matching the given `fieldName`.
 * This method implements a caching mechanism and automatic
 * disposal of allocated objects and events.
 *
 * @example
 *
 * <small>**Example - HTML code of the view**</small>
 * <pre><code class="language-html">
 * <h1 data-ui-field="title">...</h1>
 * <p data-ui-field="description">...</p>
 * </code></pre>
 *
 * <small>**Example - JavaScript**</small>
 * <pre><code class="language-js">
 * cp.field('title')
 *   .html('Hello World!');
 * var desc = cp.field('description');
 * desc.html('The spectacle before us was indeed sublime.');
 * </code></pre>
 *
 *
 * @param {!string} fieldName Value to match in the `data-ui-field` attribute.
 * @return {ZxQuery} A `{ZxQuery}` object wrapping the matching element.
 */
ContextController.prototype.field = function(fieldName) {
  // this method is "attached" from Zuix.js on controller initialization
  return null;
};
ContextController.prototype.clearCache = function() {
  this._fieldCache.length = 0;
};
/**
 * Gets the component view or if `filter` argument is passed,
 * gets the view elements matching the given `filter`
 * (shorthand for `cp.view().find(filter)`).
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // get all `checkbox` elements with `.checked` class.
 * var choices = cp.view('input[type="checkbox"].checked');
 * choices.removeClass('.checked');
 * // hide the component's view
 * cp.view().hide();
 * </code></pre>
 *
 * @param {(string|undefined)} [filter]
 * @return {ZxQuery}
 */
ContextController.prototype.view = function(filter) {
  // context view changed, dispose cached fields from previous attacched view
  if (this.context.view() != null || this._view !== this.context.view()) {
    this.clearCache();
    // TODO: !!!!
    // TODO: dispose also events on view change (!!!)
    // TODO: !!!!
    this._view = z$(this.context.view());
  }
  if (filter != null) {
    return this._view.find(filter);
  } else if (this._view !== null) {
    return this._view;
  } else {
    throw new Error('Not attached to a view yet.');
  }
};
/**
 * Gets/Sets the data model of the component.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * var m = {
 *      title: 'Thoughts',
 *      message: 'She stared through the window at the stars.'
 *  };
 * cp.model(m);
 * cp.model().title = 'Changes';
 * console.log(cp.model().title);
 * </code></pre>
 *
 * @param {object|undefined} [model] The model object.
 * @return {ContextController|object}
 */
ContextController.prototype.model = function(model) {
  if (model == null) {
    return this.context.model();
  } else this.context.model(model);
  return this;
};
/**
 * Gets the component options.
 *
 * @return {object} The component options.
 */
ContextController.prototype.options = function() {
  return this.context.options();
};
/**
 * Triggers the component event `eventPath` with the given
 * `eventData` object. To listen to a component event use the
 * `{ComponentContext}.on(eventPath, handler)` method or
 * in case `isHook` is set to true, use the
 * `zuix.hook(eventPath, handler)` method (global hook event).
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
// somewhere inside the slide-show component controller
cp.trigger('slide:change', slideIndex);

// somewhere in a page hosting the slide-show component
// set component event listeners
zuix.context('my-slide-show')
  .on('slide:change', function(slideIndex) { ... })
  .on(...);
 * </code></pre>
 *
 * @param {string} eventPath The event path.
 * @param {object} eventData The event data.
 * @param {boolean} [isHook] Trigger as global hook event.
 * @return {ContextController}
 */
ContextController.prototype.trigger = function(eventPath, eventData, isHook) {
  if (this.context._eventMap[eventPath] == null && isHook !== true) {
    this.addEvent(eventPath, null);
  }
  // TODO: ...
  if (isHook === true) {
    let target = this.context.container();
    if (target == null) target = this.context.view();
    if (target != null) {
      z$(target)
          .trigger(eventPath, eventData);
    }
    this.context.trigger(this.context, eventPath, eventData);
  } else {
    this.view().trigger(eventPath, eventData);
  }
  return this;
};
/**
 * Exposes a method or property declared in the private
 * scope of the controller as a public member of the
 * component context object.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre data-line="5"><code class="language-js">
 * // somewhere in the `create` method of the {ContextController}
 * zuix.controller(function(cp){
 *   cp.create = function() {
 *     // ....
 *     cp.expose('setSlide', slide);
 *   }
 *   // ...
 *   function slide(slideIndex) { ... }
 *   // ...
 * });
 * // ...
 * // calling the exposed method
 * // from the component context
 * var ctx = zuix.context('my-slide-show');
 * ctx.setSlide(2);
 * </code></pre>
 *
 * @param {string|JSON} methodName Name of the exposed function, or list of method-name/function pairs.
 * @param {function} [handler] Reference to the controller member to expose.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.expose = function(methodName, handler) {
  if (typeof methodName === 'object') {
    const _t = this;
    z$.each(methodName, function(k, v) {
      _t.context[k] = v;
    });
  } else this.context[methodName] = handler;
  return this;
};
/**
 * Loads the `.css` file and replace the current view style of the component.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.css' by default
 * cp.loadCss();
 * // or loads the view css with provided options
 * cp.loadCss({
 *     path: 'url/of/style/file.css',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @param {object} [options] The options object.
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadCss = function(options) {
  this.context.loadCss(options);
  return this;
};
/**
 * Loads the `.html` file and replace the view markup of the component.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.html' by default
 * cp.loadHtml();
 * // or loads the view html with provided options
 * cp.loadHtml({
 *     path: 'url/of/view/file.html',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @param {object} [options] The options object.
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadHtml = function(options) {
  this.saveView();
  this.context.loadHtml(options);
  return this;
};
/**
 * @description The component logger instance.
 *
 * @example
 *
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // same as log.info (...)
 * log.i('Component view', ctx.view());
 * // same as log.error(...)
 * log.e('Error loading data', dataUrl);
 * // other methods are:
 * // log.w(...) / log.warn (...)
 * // log.d(...) / log.debug(...)
 * // log.t(...) / log.trace(...)
 * </code></pre>
 *
 * @type {Logger}
 */
ContextController.prototype.log = {};
/**
 * Register this one as the default controller
 * for the given component type.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
<pre data-line="6"><code class="language-js">
// Controller of component 'path/to/component_name'
var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
</pre></code>
 *
 * @param {!string} componentId Component identifier.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.for = function(componentId) {
  // this method is "attached" from Zuix.js on controller initialization
  return this;
};

module.exports = ContextController;


/***/ }),

/***/ 541:
/***/ ((module) => {

/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

const OptionAttributes = Object.freeze({
  dataBindModel:
        'z-model,data-bind-model',
  dataBindTo:
        'z-bind,data-bind-to',
  dataUiComponent:
        'z-component',
  dataUiContext:
        'z-context,data-ui-context',
  dataUiField:
        'z-field,data-ui-field',
  dataUiInclude:
        'z-include,data-ui-include',
  dataUiLazyload:
        'z-lazy,data-ui-lazyload',
  dataUiLoad:
        'z-load,data-ui-load',
  dataUiLoaded:
        'z-loaded',
  dataUiOptions:
        'z-options,data-ui-options',
  dataUiPriority:
        'z-priority,data-ui-priority',
  dataUiView:
        'z-view,data-ui-view',
  zuixLoaded:
        'zuix-loaded'
});

module.exports = OptionAttributes;


/***/ }),

/***/ 643:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */



const _optionAttributes =
    __webpack_require__(541);
const util =
    __webpack_require__(826);

const _controllerOnlyAttribute = '_ctrl_';
const _cssIdAttribute = '_css_';

/**
 *
 * @param {ComponentContext} context
 * @constructor
 */
function ViewObserver(context) {
  const _t = this._context = context;
  /**
     *
     * @type {MutationObserver|null}
     * @private
     */
  this._mutationObserver = null;
  /**
     * @private
     * @type {MutationCallback}
     */
  this._mutationCallback =
        /**
         * @param mutationsList
         * @param observer
         * @private
         */
        function(mutationsList, observer) {
          const zc = util.dom.queryAttribute(_optionAttributes.dataUiComponent);
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach(function(node) {
                if (node instanceof Element) {
                  let parent = zuix.$(node).parent(zc);
                  if (parent.get() == null) return;
                  if (_t.options().css !== false && parent.attr(_controllerOnlyAttribute) == null) {
                    if ((parent.get() === _t._container || parent.get() === _t._view)) {
                      let found = false;
                      for (let i = 0; i < node.attributes.length; i++) {
                        if (node.attributes[i].name.startsWith(_cssIdAttribute)) {
                          found = true;
                          break;
                        }
                      }
                      if (!found) {
                        util.dom.setAttribute(node, _t.getCssId(), '');
                      }
                    }
                  } else {
                    let c = 0;
                    do {
                      c++;
                      parent = parent.parent(zc);
                    } while (c < 10 && parent.get() != null && parent.attr(_controllerOnlyAttribute) != null);
                    if (parent.get()) {
                      parent = zuix.context(parent);
                      let found = false;
                      for (let i = 0; i < node.attributes.length; i++) {
                        if (node.attributes[i].name.startsWith(_cssIdAttribute)) {
                          found = true;
                          break;
                        }
                      }
                      if (!found) {
                        util.dom.setAttribute(node, parent.getCssId(), '');
                        zuix.$(node).find('*').each(function() {
                          this.attr(parent.getCssId(), '');
                        });
                      }
                    }
                  }
                }
              });
            }
            // TODO: this might be used for improving data binding
            // else if (mutation.type === 'attributes') {
            //     console.log('The ' + mutation.attributeName + ' attribute was modified.');
            // }
          }
        };
}
ViewObserver.prototype.start = function() {
  this.stop();
  const config = {attributes: false, childList: true, subtree: true};
  this._mutationObserver = new MutationObserver(this._mutationCallback);
  this._mutationObserver.observe(this._context._view, config);
};
ViewObserver.prototype.stop = function() {
  if (this._mutationObserver != null) {
    this._mutationObserver.disconnect();
    this._mutationObserver = null;
  }
};

module.exports = ViewObserver;


/***/ }),

/***/ 459:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 *
 */



const _log =
    __webpack_require__(381)('Zuix.js');
const util =
    __webpack_require__(826);
const z$ =
    __webpack_require__(917);
const TaskQueue =
    __webpack_require__(65);
const ObjectObserver =
    __webpack_require__(265);
const ComponentContext =
    __webpack_require__(622);
const ContextController =
    __webpack_require__(561);
const _componentizer =
    __webpack_require__(211)();
const _optionAttributes =
    __webpack_require__(541);

__webpack_require__(854);

// Custom objects definition used to generate JsDoc

/**
 * This object can be supplied when loading a component. It can be either passed as argument for the
 * `zuix.load(...)` method in the javascript code, or in the `data-ui-options` attribute of the HTML code
 * of the component container.
 *
 * @typedef {object} ContextOptions
 * @property {Object|undefined} contextId The context id. HTML attribute equivalent: `data-ui-context`.
 * @property {Element|undefined} container The container element.
 * @property {JSON|undefined} model The data model.  HTML attribute equivalent: `data-bind-model`.
 * @property {Element|undefined} view The view element. HTML attribute equivalent: `data-ui-view`.
 * @property {ContextControllerHandler|undefined} controller The controller handler.
 * @property {Array.<Object.<string, EventCallback>>|undefined} on The handling map for events.
 * @property {Array.<Object.<string, EventCallback>>|undefined} behavior The handling map for behaviors.
 * @property {Element|string|boolean|undefined} css The stylesheet of the view.
 * @property {boolean|undefined} encapsulation Whether to use style encapsulation or not.
 * @property {boolean|undefined} resetCss Whether to reset view style to prevent inheriting from parent containers.
 * @property {string|undefined} cext When loading content of the view, appends the specified extension instead of `.html`.
 * @property {boolean|undefined} html Enables or disables HTML auto-loading (**default:** true).
 * @property {boolean|undefined} lazyLoad Enables or disables lazy-loading (**default:** false).
 * @property {number|undefined} priority Loading priority (**default:** 0).
 * @property {ContextReadyCallback|undefined} ready The ready callback, triggered once the component is succesfully loaded.
 * @property {ContextErrorCallback|undefined} error The error callback, triggered when an error occurs.
 */

/**
 * Callback function triggered if an error occurs when loading a component.
 *
 * @callback ContextErrorCallback
 * @param {Object} error
 * @param {ComponentContext} ctx The component context object (same as `this`).
 * @this {ComponentContext}
 */

/**
 * Callback function triggered when a component has been successfully loaded.
 *
 * @callback ContextReadyCallback
 * @param {ComponentContext} ctx The component context (same as `this`).
 * @this {ComponentContext}
 */


/**
 * @private
 * @type {!Array.<ComponentContext>}
 */
const _contextRoot = [];
/** @private */
const _hooksCallbacks = [];
/** @private */
const _globalHandlers = {};
/** @private **/
const _componentTask = [];
/** @private **/
const _pendingResourceTask = {};
/** @private */
const resourceLoadTask = [];
/**
 * @private
 * @param {String} tid Task id
 * @return {TaskQueue}
 */
const taskQueue = function(tid) {
  if (util.isNoU(_componentTask[tid])) {
    _componentTask[tid] = new TaskQueue(function(tq, eventPath, eventValue) {
      trigger(tq, eventPath, eventValue);
    });
  }
  return _componentTask[tid];
};

/**
 * @private
 * @type {!Array.<ComponentCache>}
 */
let _componentCache = [];
/** @private */
let _contextSeqNum = 0;
/** @private */
let _enableHttpCaching = true;
/** @private */
const _objectObserver = new ObjectObserver();

/**
 *  zUIx, Javascript library for component-based development.
 *
 * @class Zuix
 * @constructor
 * @return {Zuix}
 */
function Zuix() {
  _componentizer.setHost(this);
  /**
     * @type {Array}
     * @private
     */
  this._store = [];
  /**
     * @type {!Array.<ZxQuery>}
     * @private
     **/
  this._fieldCache = [];
  return this;
}

/**
 *
 * @private
 * @param {ContextControllerHandler} handler The context controller handler
 * @return {ContextControllerHandler}
 */
function controller(handler) {
  if (typeof handler['for'] !== 'function') {
    handler['for'] = function(componentId) {
      _globalHandlers[componentId] = handler;
      return handler;
    };
  }
  return handler;
}

/**
 *
 * @private
 * @param {!string} fieldName Value to match in the `data-ui-field` attribute.
 * @param {!Element|!ZxQuery} [container] Starting DOM element for this search (**default:** *document*)
 * @param {object} [context] The context
 * @return {ZxQuery} ZxQuery object with elements matching the given ```data-ui-field``` attribute.
 * If the matching element is just one, then it will also have the extra method `field(fieldName)`
 * to search for fields contained in it.
 *
 */
function field(fieldName, container, context) {
  if (util.isNoU(context)) {
    context = this;
  }
  if (context._fieldCache == null) {
    context._fieldCache = {};
  }

  let el = null;
  if (typeof context._fieldCache[fieldName] === 'undefined') {
    el = z$(container).find(util.dom.queryAttribute(_optionAttributes.dataUiField, fieldName));
    if (el != null && el.length() > 0) {
      context._fieldCache[fieldName] = el;
      // extend the returned `ZxQuery` object adding the `field` method
      if (el.length() === 1 && util.isNoU(el.field)) {
        el.field = function(name) {
          return field(name, el, el);
        };
      }
    }
  } else el = context._fieldCache[fieldName];

  return el;
}

/**
 *
 * @private
 * @param {!string} componentId The id/name of the component we want to load.
 * @param {ContextOptions|undefined} [options] context options used to initialize the loaded component
 * @return {ComponentContext}
 */
function load(componentId, options) {
  // TODO: throw error on argument mismatch
  // TODO: prevent load loops when including recursively a component
  componentId = _componentizer.resolvePath(componentId);
  /** @type {ComponentContext} */
  let ctx = null;
  if (!util.isNoU(options)) {
    // the `componentId` property is mandatory for `createContext` to work properly
    options.componentId = componentId;
    // check if context has its unique id assigned
    if (!util.isNoU(options.contextId)) {
      // if it does, try to pick it from allocated contexts list
      ctx = context(options.contextId);
      if (ctx !== null) {
        ctx.options(options);
      } else {
        // if no context is already allocated
        // with that id, then add a new one
        ctx = createContext(options);
      }
    } else {
      if (options === false) {
        options = {};
      }
      // generate contextId (this is a bit buggy, but it's quick)
      options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
      ctx = createContext(options);
    }
  } else {
    // TODO: check if this case is of any use
    // empty context
    options = {};
    ctx = new ComponentContext(zuix, options, trigger);
  }

  // assign the given component (widget) to this context
  if (ctx.componentId != componentId) {
    // mutable component, rebind to a different component
    // preserving current context data
    ctx.componentId = componentId;
    /*
         TODO: to be fixed
         if (!util.isNoU(context.view())) {
         // TODO: implement this code in a context.detach() method
         //context.controller().pause()
         context.view().detach();
         context.view(null);
         }*/
  }

  if (util.isFunction(options.ready)) {
    ctx.ready = options.ready;
  }
  if (util.isFunction(options.error)) {
    ctx.error = options.error;
  }

  if (resourceLoadTask[componentId] == null) {
    resourceLoadTask[componentId] = true;
    return loadResources(ctx, options);
  } else {
    if (_pendingResourceTask[componentId] == null) {
      _pendingResourceTask[componentId] = [];
    }
    _pendingResourceTask[componentId].push({c: ctx, o: options});
  }

  return ctx;
}

function getResourcePath(path) {
  let config = zuix.store('config');
  if (config != null && config[location.host] != null) {
    config = config[location.host];
  }
  path = _componentizer.resolvePath(path);
  if (!path.startsWith('//') && path.indexOf('://') < 0) {
    path = (config != null && config.resourcePath != null ? config.resourcePath : '') + path;
  }
  return path;
}

/**
 * @private
 * @param {ComponentContext} ctx Component context
 * @param {JSON} options Context loading options
 * @return {ComponentContext}
 */
function loadResources(ctx, options) {
  // pick it from cache if found
  /** @type {ComponentCache} */
  let cachedComponent = getCachedComponent(ctx.componentId);
  if (cachedComponent !== null && options.controller == null && ctx.controller() == null) {
    ctx.controller(cachedComponent.controller);
    _log.t(ctx.componentId+':js', 'component:cached:js');
  }

  if (util.isNoU(options.view)) {
    if (cachedComponent !== null) {
      if (cachedComponent.view != null) {
        ctx.view(cachedComponent.view);
        _log.t(ctx.componentId+':html', 'component:cached:html');
      }
      /*
             TODO: CSS caching, to be tested.
             */
      if (options.css !== false) {
        options.css = false;
        if (!cachedComponent.css_applied) {
          cachedComponent.css_applied = true;
          ctx.style(cachedComponent.css);
          _log.t(ctx.componentId + ':css', 'component:cached:css');
        }
      }
    }

    // if not able to inherit the view from the base cachedComponent
    // or from an inline element, then load the view from web
    if (util.isNoU(ctx.view())) {
      // Load View
      taskQueue('resource-loader').queue(ctx.componentId+':html', function() {
        resourceLoadTask[ctx.componentId] = this;

        ctx.loadHtml({
          cext: options.cext,
          caching: _enableHttpCaching,
          success: function(html) {
            if (cachedComponent == null) {
              cachedComponent = cacheComponent(ctx);
            }
            cachedComponent.view = html;
            delete cachedComponent.controller;
            if (options.css !== false) {
              resourceLoadTask[ctx.componentId].step(ctx.componentId+':css');
              ctx.loadCss({
                caching: _enableHttpCaching,
                success: function(css) {
                  cachedComponent.css = css;
                },
                error: function(err) {
                  _log.e(err, ctx);
                },
                then: function() {
                  loadController(ctx, resourceLoadTask[ctx.componentId]);
                }
              });
            } else {
              loadController(ctx, resourceLoadTask[ctx.componentId]);
            }
          },
          error: function(err) {
            _log.e(err, ctx);
            if (util.isFunction(options.error)) {
              (ctx.error).call(ctx, err, ctx);
            }
          }
        });
      }, options.priority);
      // defer controller loading
      return ctx;
    }
  } else {
    ctx.view(options.view);
  }
  if (ctx.controller() == null) {
    taskQueue('resource-loader').queue(ctx.componentId + ':js', function() {
      resourceLoadTask[ctx.componentId] = this;
      loadController(ctx, resourceLoadTask[ctx.componentId]);
    }, _contextRoot.length);
  } else loadController(ctx);

  return ctx;
}
/**
 *
 * @private
 * @param context {ComponentContext|Element}
 */
function unload(context) {
  if (context instanceof Element) {
    const el = context;
    context = zuix.context(el);
    // remove element from componentizer queue if
    // it's a lazy-loadable element not yet loaded
    _componentizer.dequeue(el);
  }
  if (!util.isNoU(context)) {
    context.dispose();
  }
}

/** @private */
function createContext(options) {
  const context = new ComponentContext(zuix, options, trigger);
  _contextRoot.push(context);
  return context;
}

/**
 *
 * @private
 * @param {Element|ZxQuery|object} contextId The `contextId` object
 * (usually a string) or the container/view element of the component.
 * @param {function} [callback] The callback function that will pass the context object once it is ready.
 * @return {ComponentContext} The matching component context or `null` if the context does not exists or it is not yet loaded.
 */
function context(contextId, callback) {
  let context = null;
  if (contextId instanceof z$.ZxQuery) {
    contextId = contextId.get();
  } else if (typeof contextId === 'string') {
    const ctx = z$.find(util.dom.queryAttribute(_optionAttributes.dataUiContext, contextId));
    if (ctx.length() > 0) contextId = ctx.get();
  }
  z$.each(_contextRoot, function(k, v) {
    if ((contextId instanceof Element && (v.view() === contextId || v.container() === contextId)) ||
            util.objectEquals(v.contextId, contextId)) {
      context = v;
      return false;
    }
  });
  if (typeof callback === 'function' && (contextId instanceof Element || contextId instanceof z$.ZxQuery)) {
    if (context == null || !context.isReady) {
      z$(contextId).one('component:ready', function() {
        context = zuix.context(this);
        callback.call(context, context);
      });
    } else callback.call(context, context);
  }
  return context;
}

/**
 *
 * @private
 * @param {string} path
 * @param {function|undefined} handler
 */
function hook(path, handler) {
  if (util.isNoU(handler)) {
    delete _hooksCallbacks[path];
  } else _hooksCallbacks[path] = handler;
}

/**
 * Fires a zUIx hook.
 *
 * @private
 * @param {object} context
 * @param {string} path
 * @param {object|undefined} data
 */
function trigger(context, path, data) {
  if (util.isFunction(_hooksCallbacks[path])) {
    _hooksCallbacks[path].call(context, data, context);
  }
}

/**
 * Enable/Disable HTTP caching
 *
 * @private
 * @param {boolean} [enable]
 * @return {boolean} *true* if HTTP caching is enabled, *false* otherwise.
 */
function httpCaching(enable) {
  if (enable != null) {
    _enableHttpCaching = enable;
  }
  return _enableHttpCaching;
}

// *********************** private members ************************* //


/** @private */
function removeCachedComponent(componentId) {
  // TODO: removeCachedComponent
  // TODO: should this be called when last instance of a component type is disposed?
}

/**
 * @private
 * @param {Object} componentId
 * @return {ComponentCache}
 */
function getCachedComponent(componentId) {
  /** @type {ComponentCache|null} */
  let cached = null;
  z$.each(_componentCache, function(k, v) {
    if (util.objectEquals(v.componentId, componentId)) {
      cached = v;
      return false;
    }
  });
  return cached;
}

/**
 * @private
 * @param {ComponentContext} context
 * @param {TaskQueue} [task]
 */
function loadController(context, task) {
  if (typeof context.options().controller === 'undefined' && context.controller() === null) {
    _log.d(context.componentId, 'controller:load');
    if (!util.isNoU(task)) {
      task.step(context.componentId+':js');
    }
    if (util.isFunction(_globalHandlers[context.componentId])) {
      context.controller(_globalHandlers[context.componentId]);
      createComponent(context, task);
    } else {
      const job = function(t) {
        const jsPath = context.componentId + '.js' + (_enableHttpCaching ? '' : '?'+new Date().getTime());
        z$.ajax({
          url: getResourcePath(jsPath),
          success: function(ctrlJs) {
            // TODO: improve js parsing!
            try {
              const fn = ctrlJs.indexOf('function');
              const il = ctrlJs.indexOf('.load');
              if (il > 1 && il < fn) {
                ctrlJs = ctrlJs.substring(0, il - 4);
              }
              const ih = ctrlJs.indexOf('.controller');
              if (ih > 1 && ih < fn) {
                ctrlJs = ctrlJs.substring(ih + 11);
              }
              const ec = ctrlJs.indexOf('//<--controller');
              if (ec > 0) {
                ctrlJs = ctrlJs.substring(0, ec);
              }
              ctrlJs += '\n//# sourceURL="'+context.componentId + '.js"\n';
              context.controller(getController(ctrlJs));
            } catch (e) {
              _log.e(new Error(), e, ctrlJs, context);
              if (util.isFunction(context.error)) {
                (context.error).call(context, e, context);
              }
            }
          },
          error: function(err) {
            _log.e(err, new Error(), context);
            if (util.isFunction(context.error)) {
              (context.error).call(context, err, context);
            }
          },
          then: function() {
            createComponent(context, t);
          }
        });
      };
      if (util.isNoU(task)) {
        taskQueue('resource-loader').queue(context.componentId+':js', function() {
          job(resourceLoadTask[context.componentId] = this);
        }, context.options().priority);
      } else job(task);
    }
  } else {
    createComponent(context, task);
  }
}

function cacheComponent(context) {
  const html = context.view().innerHTML; // (context.view() === context.container() ? context.view().innerHTML : context.view().outerHTML);
  const c = z$.wrapElement('div', html);
  /** @type {ComponentCache} */
  const cached = {
    componentId: context.componentId,
    view: c.innerHTML,
    css: context._css,
    controller: context.controller()
  };
  _componentCache.push(cached);
  _log.t(context.componentId, 'bundle:added');
  return cached;
}

/**
 * @private
 * @param {ComponentContext} context
 * @param {TaskQueue} [task]
 */
function createComponent(context, task) {
  resourceLoadTask[context.componentId] = null;
  if (!util.isNoU(context.view())) {
    let cached = getCachedComponent(context.componentId);
    if (!context.options().viewDeferred) {
      if (cached === null) {
        cached = cacheComponent(context);
      } else if (cached.controller == null) {
        cached.controller = context.controller();
      }
    } else _log.w(context.componentId, 'component:deferred:load');

    if (task != null) {
      task.callback(function() {
        _log.d(context.componentId, 'controller:create:deferred');
        initController(context._c);
      });
    }
    const v = z$(context.view());
    if (v.attr(_optionAttributes.dataUiContext) == null) {
      v.attr(_optionAttributes.dataUiContext, context.contextId);
    }

    _log.d(context.componentId, 'component:initializing');
    if (util.isFunction(context.controller())) {
      // TODO: should use 'require' instead of 'new Controller' ... ?
      /** @type {ContextController} */
      const c = context._c = new ContextController(context);
      c.log = __webpack_require__(381)(context.contextId);
      if (typeof c.init === 'function') {
        c.init();
      }
      if (!util.isNoU(c.view())) {
        // if it's not null, a controller was already loaded, so we preserve the base controller name
        // TODO: when loading multiple controllers perhaps some code paths can be skipped -- check/optimize this!
        if (c.view().attr(_optionAttributes.dataUiComponent) == null) {
          c.view().attr(_optionAttributes.dataUiComponent, '');
        }
        // if no model is supplied, try auto-create from view fields
        if (util.isNoU(context.model()) && !util.isNoU(context.view())) {
          context.viewToModel();
        }
        if (context.options().viewDeferred) {
          context.options().viewDeferred = false;
          // save the original inline view
          // before loading the view template
          // it can be then restored with c.restoreView()
          c.saveView();

          // TODO: check if this case is still required, otherwise remove it.
          if (cached === null) {
            cached = {
              componentId: context.componentId,
              controller: context.controller()
            };
            _componentCache.push(cached);
            _log.t(context.componentId, 'bundle:added');
            _log.d(context.componentId, 'component:deferred:load');
          }

          let pending = -1;
          if (context.options().css !== false) {
            if (cached.css == null) {
              if (pending === -1) pending = 0;
              pending++;
              context.loadCss({
                caching: _enableHttpCaching,
                success: function(css) {
                  // TODO: this is a work-around for 'componentize' overlapping issue
                  if (cached.css == null) {
                    cached.css = css;
                  }
                  _log.d(context.componentId, 'component:deferred:css', pending);
                },
                then: function() {
                  if (--pending === 0 && task != null) {
                    task.end();
                  }
                }
              });
            } else context.style(cached.css);
          }
          if (context.options().html !== false) {
            if (cached.view == null) {
              if (pending === -1) pending = 0;
              pending++;
              context.loadHtml({
                cext: context.options().cext,
                caching: _enableHttpCaching,
                success: function(html) {
                  // TODO: this is a work-around for 'componentize' overlapping issue
                  if (cached.view == null) {
                    cached.view = html;
                  }
                  _log.d(context.componentId, 'component:deferred:html', pending);
                },
                error: function(err) {
                  _log.e(err, context);
                  if (util.isFunction(context.options().error)) {
                    (context.options().error).call(context, err, context);
                  }
                },
                then: function() {
                  if (--pending === 0 && task != null) {
                    task.end();
                  }
                }
              });
            } else context.view(cached.view);
          }
          if (pending === -1 && task != null) {
            task.end();
          }
        } else if (task != null) task.end();
      }
      c.trigger('view:apply');

      if (task == null) {
        _log.d(context.componentId, 'controller:create');
        initController(c);
      }
    } else {
      _log.w(context.componentId, 'component:controller:undefined');
    }
  } else {
    // TODO: should report error or throw an exception
    _log.e(context.componentId, 'component:view:undefined');
  }
}

/**
 * @private
 * @param {ContextController} c
 */
function initController(c) {
  _log.t(c.context.componentId, 'controller:init', 'timer:init:start');

  // re-enable nested components loading
  c.view().find(util.dom.queryAttribute(_optionAttributes.dataUiLoaded, 'false', util.dom.cssNot(_optionAttributes.dataUiComponent)))
      .each(function(i, v) {
        this.attr(_optionAttributes.dataUiLoaded, null);
      });

  // bind {ContextController}.field method
  c.field = function(fieldName) {
    const el = field(fieldName, c.view(), c);
    el.on = function(eventPath, eventHandler, eventData, isHook) {
      if (typeof eventHandler === 'string') {
        const eh = eventHandler;
        eventHandler = function() {
          c.trigger(eh, eventData, isHook);
        };
      }
      return z$.ZxQuery.prototype.on.call(this, eventPath, eventHandler);
    };
    return el;
  };

  if (util.isFunction(c.create)) c.create();
  c.trigger('view:create');

  if (util.isFunction(c.context.ready)) {
    (c.context.ready).call(c.context, c.context);
  }

  c.trigger('component:ready', c.view(), true);
  c.context.isReady = true;

  _log.t(c.context.componentId, 'controller:init', 'timer:init:stop');
  _log.i(c.context.componentId, 'component:loaded', c.context.contextId);

  if (_pendingResourceTask[c.context.componentId] != null) {
    const pendingRequests = _pendingResourceTask[c.context.componentId];
    _pendingResourceTask[c.context.componentId] = null;
    let ctx;
    while (pendingRequests != null && (ctx = pendingRequests.shift()) != null) {
      loadResources(ctx.c, ctx.o);
    }
  }

  zuix.componentize(c.view());
}

/**
 * @private
 * @param javascriptCode string
 * @return {ContextControllerHandler}
 */
// TODO: refactor this method name
function getController(javascriptCode) {
  let instance = function(ctx) { };
  if (typeof javascriptCode === 'string') {
    try {
      instance = (eval).call(this, javascriptCode);
    } catch (e) {
      // TODO: should trigger a global hook
      // eg. 'controller:error'
      _log.e(this, e, javascriptCode);
    }
  }
  return instance;
}

function replaceCache(c) {
  _componentCache = c;
}

// ******************* proto ******************** //


/**
 * Search the document or inside the given `container` for elements
 * with `data-ui-field` attribute matching the provided `fieldName`.
 * This method implements a caching mechanism and automatic
 * disposal of allocated objects and events.
 *
 * @example
 *
<small>**Example - HTML**</small>
```html
<div data-ui-field="sample-container">
   <!-- container HTML -->
</div>
```

<small>**Example - JavaScript**</small>
```js
var container = zuix.field('sample-container');
container.html('Hello World!');
```
 *
 * @param {!string} fieldName Value of `data-ui-field` to look for.
 * @param {!Element} [container] Starting DOM element for this search (**default:** *document*)
 * @return {ZxQuery} ZxQuery object with elements matching the given ```data-ui-field``` attribute.
 * If the matching element is just one, then it will also have the extra method `field(fieldName)`
 * to search for fields contained in it.
 *
 */
Zuix.prototype.field = function(fieldName, container) {
  return field.call(this, fieldName, container);
};
/**
 * Loads a component.
 * This is the programmatic equivalent of `data-ui-include`
 * or `data-ui-load` attributes used to
 * include content or load components from the HTML code.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
// declare inline the controller for component 'example/component'
const exampleController = zuix.controller((cp) => {
    // declare `create` life-cycle callback
    cp.create = () => {
        // expose a public method
        cp.expose('test', testMethod);
        // set the content of the view
        cp.view().html('Helllo World!');
    }
    function testMethod() {
        cp.log.i("Method exposing test");
        cp.view().html('A simple test.');
    }
}).for('example/component');

// store a reference to the container
const container = zuix.field('sample-container');

 // declare loading options
const componentOptions = {
    view: container,
    // callback called after the component is loaded
    ready: (ctx) => {
        ctx..log("Loading complete.");
        ctx.log("Component instance context", this);
        // call the `test` method after 1s
        setTimeout(ctx.test, 1000);
    },
    // callback called if an error occurs
    error: (error) => {
        console.log("Loading error!", error);
    }
};
zuix.load('example/component', componentOptions);
```
 *
 * @param {!string} componentId The identifier name of the component to be loaded.
 * @param {ContextOptions} [options] Options used to initialize the loaded component.
 * @return {ComponentContext} The component context.
 */
Zuix.prototype.load = function(componentId, options) {
  return load.call(this, componentId, options);
};
/**
 * Unloads the given component context releasing all allocated resources.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
zuix.unload(ctx);
```
 *
 * @param {ComponentContext|Element} context The instance of the component to be unloaded or its container element.
 * Pass *Element* type if the underlying component is lazy-loadable and it might not have been instantiated yet.
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.unload = function(context) {
  unload(context);
  return this;
};
/**
 * Allocates the handler for the component controller. The provided `handler` function will be called
 * to initialize the controller object once the component has been loaded.
 *
 * @example
 *
 <small>**Example - JavaScript**</small>
 <pre data-line="2"><code class="language-js">
 // Allocates the controller handler to be used for the component 'path/to/component_name'
 var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
 </code></pre>
 *
 * @param {ContextControllerHandler} handler Function called to initialize the component controller that will be passed as argument of this function.
 * @return {ContextControllerHandler} The allocated controller handler.
 */
Zuix.prototype.controller = function(handler) {
  return controller.call(this, handler);
};
/**
 * Gets a `ComponentContext` object, given its `contextId` or its container/view element.
 * The `contextId` is the one specified by the `ContextOptions` object or by using the HTML attribute `data-ui-context`.
 *
 * @example
 *
<small>**Example - HTML**</small>
```html
<div data-ui-load="site/components/slideshow"
     data-ui-context="my-slide-show">...</div>
```
<small>**Example - JavaScript**</small>
```js
var slideShowDiv = zuix.$.find('[data-ui-context="my-slide-show"]');
var ctx = zuix.context(slideShowDiv);
// or
var ctx = zuix.context('my-slide-show');
// call exposed component methods
ctx.setSlide(1);
// or
var ctx;
zuix.context('my-slide-show', function(c) {
    // call component methods
    c.setSlide(1);
    // eventually store a reference to the component for later use
    ctx = c;
});
```
 *
 * @param {Element|ZxQuery|object} contextId The `contextId` object
 * (usually a string) or the container/view element of the component.
 * @param {function} [callback] The callback function that will be called once the component is loaded. The {ComponentContext} object will be passed as argument of this callback.
 * @return {ComponentContext} The matching component context or `null` if the component does not exists or it is not yet loaded.
 */
Zuix.prototype.context = function(contextId, callback) {
  return context.call(this, contextId, callback);
};
/**
 * Creates the component specified by `componentId` and returns its `{ComponentContext}` object.
 * The returned component it's unloaded and detached from the DOM and it must be explicitly attached.
 * After attaching it to the DOM, `zuix.componentize()` must be called in
 * order to actually load and display the component.
 *
 * @param {string} componentId Identifier name of the component to create.
 * @param {ContextOptions|undefined} [options] Component context options.
 * @return {ComponentContext}
 */
Zuix.prototype.createComponent = function(componentId, options) {
  if (options == null) options = {};
  if (util.isNoU(options.contextId)) {
    options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
  }
  if (context(options.contextId) != null) {
    throw new Error('Context arelady exists.');
  } else {
    options.container = document.createElement('div');
    options.componentId = componentId;
    _componentizer.applyOptions(options.container, options);
  }
  return createContext(options);
};
/**
 * Triggers the event specified by `eventPath`.
 *
 * @param {Object} context The context object (`this`) passed to handler functions listening to this event.
 * @param {string} eventPath The path of the event to fire.
 * @param {object} [eventData] The data object of the event.
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.trigger = function(context, eventPath, eventData) {
  trigger(context, eventPath, eventData);
  return this;
};
/**
 * Registers a callback for a global zUIx event.
 * There can only be one callback for each kind of global hook event.
 * Pass null as <eventHandler> to stop listening to a previously registered callback.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
// The context `this` in the event handlers will be
// the {ComponentContext} object that sourced the event.
// The `data` parameter passed to the handlers, is of
// variant type, depending on the type of the occurring event.
zuix
  .hook('load:begin', function(data){
    loaderMessage.html('Loading "'+data.task+'" ...');
    loaderMessage.show();

}).hook('load:next', function(data){
    loaderMessage.html('"'+data.task+'" done, loading next..');

}).hook('load:end', function(){
    loaderMessage.hide();

}).hook('html:parse', function (data) {
    // ShowDown - MarkDown syntax compiler
    if (this.options().markdown === true && typeof showdown !== 'undefined')
        data.content = new showdown.Converter()
            .makeHtml(data.content);

}).hook('css:parse', function (data) {
    // process css, eg. run a CSS pre-processor
    // eg. Sass, Less, ...

}).hook('view:process', function (view) {
    // The view DOM is now fully loaded and ready

    // Prism code syntax highlighter
    view.find('code').each(function (i, block) {
        this.addClass('language-javascript');
        Prism.highlightElement(block);
    });

    // Force opening of all non-local links in a new window
    zuix.$('a[href*="://"]').attr('target','_blank');

    // Material Design Light auto-detection
    // Call DOM upgrade on newly added view elements
    if (componentHandler)
        componentHandler.upgradeElements(view.get());

});
```
 *
 * @param {string} eventPath The event path.
 * @param {function|undefined} eventHandler The handler function.
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.hook = function(eventPath, eventHandler) {
  hook(eventPath, eventHandler);
  return this;
};
/**
 * Loads a CSS or Javascript resource. All CSS styles and Javascript scripts
 * loaded with this method will be also included in the application bundle.
 * If a resource is already loaded, the request will be ignored.
 * This command is also meant to be used inside a components' controller.
 * This enables the loading of a component without the need of manually including
 * all of its dependencies since those will be automatically fetched as required.
 *
 * @example
 *
 <small>**Example - JavaScript**</small>
 <pre><code class="language-js">
 // Controller of component 'path/to/component_name'
 zuix.controller(function(cp) {
    cp.init = function() {
        zuix.using('script', 'https://some.cdn.js/moment.min.js', function(){
            // can start using moment.js
        });
    };
    cp.create = function() { ... };
    cp.destroy = function() { ... }
});
 </code></pre>
 *
 *
 * @param {string} resourceType Either `style`, `script` or `component`.
 * @param {string} resourcePath Relative or absolute resource url path
 * @param {function} [callback] Callback function to call once resource is loaded.
 * @return {void}
 */
Zuix.prototype.using = function(resourceType, resourcePath, callback) {
  resourcePath = _componentizer.resolvePath(resourcePath);
  resourceType = resourceType.toLowerCase();
  const hashId = resourceType+'-'+resourcePath.hashCode();

  if (resourceType === 'component') {
    const c = context(hashId);
    if (c == null) {
      zuix.load(resourcePath, {
        contextId: hashId,
        view: '',
        priority: -10,
        ready: function(ctx) {
          if (typeof callback === 'function') {
            callback(resourcePath, ctx);
          }
        },
        error: function() {
          callback(resourcePath, null);
        }
      });
    } else if (typeof callback === 'function') {
      // already loaded
      callback(resourcePath, c);
    }
  } else {
    const isCss = (resourceType === 'style');
    if (z$.find(resourceType + '[id="' + hashId + '"]').length() === 0) {
      const head = document.head || document.getElementsByTagName('head')[0];
      const resource = document.createElement(resourceType);
      if (isCss) {
        resource.type = 'text/css';
        resource.id = hashId;
      } else {
        resource.type = 'text/javascript';
        resource.id = hashId;
      }
      head.appendChild(resource);

      // TODO: add logging
      const addResource = function(text) {
        // TODO: add logging
        if (isCss) {
          if (resource.styleSheet) {
            resource.styleSheet.cssText = text;
          } else {
            resource.appendChild(document.createTextNode(text));
          }
        } else {
          if (resource.innerText) {
            resource.innerText = text;
          } else {
            resource.appendChild(document.createTextNode(text));
          }
        }
        if (callback) {
          callback(resourcePath, hashId);
        }
      };

      const cid = '_res/' + resourceType + '/' + hashId;
      const cached = getCachedComponent(cid);
      if (cached != null) {
        addResource(isCss ? cached.css : cached.controller);
      } else {
        z$.ajax({
          url: resourcePath,
          success: function(resText) {
            // TODO: add logging
            /** @type {ComponentCache} */
            const cached = {
              componentId: cid,
              view: null,
              css: isCss ? resText : null,
              controller: !isCss ? resText : null,
              using: resourcePath
            };
            _componentCache.push(cached);
            addResource(resText);
          },
          error: function() {
            // TODO: add logging
            head.removeChild(resource);
            if (callback) {
              callback(resourcePath);
            }
          }
        });
      }
    } else {
      // TODO: add logging
      // console.log('Resource already added ' + hashId + '(' + resourcePath + ')');
      if (callback) {
        callback(resourcePath, hashId);
      }
    }
  }
};
/**
 * Enables/Disables lazy-loading or gets the current setting.
 *
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Load-ahead threshold (default is 1.0 => 100% of view size).
 * @return {Zuix|boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Zuix.prototype.lazyLoad = function(enable, threshold) {
  if (enable != null) {
    _componentizer.lazyLoad(enable, threshold);
  } else {
    return _componentizer.lazyLoad();
  }
  return this;
};
/**
 * Enables/Disables HTTP caching or gets the current settings.
 *
 * @param {boolean} [enable]
 * @return {Zuix|boolean} *true* if HTTP caching is enabled, *false* otherwise.
 */
Zuix.prototype.httpCaching = function(enable) {
  if (enable != null) {
    httpCaching(enable);
  } else {
    return httpCaching();
  }
  return this;
};
/**
 * Searches the document, or inside the given ```element```,
 * for all ```data-ui-include``` and ```data-ui-load``` attributes
 * and processes these by loading the requested components.
 * This is a service function that should only be called if dynamically
 * adding content with elements that contain *load* or *include* directives.
 *
 * @example
 *
 <small>**Example - JavaScript**</small>
 ```js
 zuix.componentize(document);
 ```
 *
 * @param {Element|ZxQuery} [element] Container to use as starting node for the search (**default:** *document*).
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.componentize = function(element) {
  _componentizer.componentize(element);
  return this;
};
/**
 * Gets/Sets a global store entry.
 * @param {string} name Entry name
 * @param {object} value Entry value
 * @return {object}
 */
Zuix.prototype.store = function(name, value) {
  if (value != null) {
    this._store[name] = value;
  }
  return this._store[name];
};
/**
 * Get a resource path.
 * @param {string} path resource id/path
 * @return {string}
 */
Zuix.prototype.getResourcePath = function(path) {
  return getResourcePath(path);
};
/**
 * Get an observable instance of an object for detecting changes.
 * @param {Object} obj Object to observe
 * @return {ObservableObject} The observable object
 */
Zuix.prototype.observable = function(obj) {
  return _objectObserver.observable(obj);
};
/**
 * Gets/Sets the components data bundle.
 *
 * @param {!Array.<BundleItem>} bundleData A bundle object holding in memory all components data (cache).
 * @param {function} [callback]
 * @return {Zuix|Array.<BundleItem>}
 */
Zuix.prototype.bundle = function(bundleData, callback) {
  if (util.isNoU(bundleData)) {
    return _componentCache;
  } else if (bundleData && typeof bundleData === 'boolean') {
    _log.t('bundle:start');
    const ll = _componentizer.lazyLoad();
    _componentizer.lazyLoad(false);
    _componentizer.componentize();
    if (typeof callback === 'function') {
      const waitLoop = function(w) {
        setTimeout(function() {
          if (_componentizer.willLoadMore()) {
            _log.t('bundle:wait');
            w(w);
          } else {
            _log.t('bundle:end');
            _componentizer.lazyLoad(ll);
            callback();
          }
        }, 1000);
      };
      waitLoop(waitLoop);
    }
  } else {
    // reset css flag before importing bundle
    for (let c = 0; c < bundleData.length; c++) {
      if (bundleData[c].css_applied) {
        delete bundleData[c].css_applied;
      }
      if (typeof bundleData[c].controller === 'string') {
        bundleData[c].controller = eval(bundleData[c].controller);
      }
    }
    _componentCache = bundleData;
  }
  return this;
};

/**
 * @description Helper class for querying and manipulating the DOM.
 * @property {ZxQueryStatic}
 */
Zuix.prototype.$ = z$;
// private
Zuix.prototype.TaskQueue = TaskQueue;
Zuix.prototype.ObjectObserver = ObjectObserver;
Zuix.prototype.ZxQuery = z$.ZxQuery;
/**
 * Dumps content of the components cache. Mainly for debugging purpose.
 * @return {Array<ComponentCache>}
 */
Zuix.prototype.dumpCache = function() {
  return _componentCache;
};
/**
 * Dumps allocated component contexts. Mainly for debugging purpose.
 * @return {Array<ComponentContext>}
 */
Zuix.prototype.dumpContexts = function() {
  return _contextRoot;
};

// TODO: add zuix.options to configure stuff like
// TODO: the css/html/js lookup base path (each individually own prop)

/**
 * @param root
 * @return {Zuix}
 */
module.exports = function(root) {
  const zuix = new Zuix();
  if (document.readyState != 'loading') {
    zuix.componentize();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      zuix.componentize();
    });
  }
  // log messages monitor (one global listener)
  _log.monitor(function(level, args) {
    if (util.isFunction(zuix.monitor)) {
      zuix.monitor(level, Array.prototype.slice.call(args));
    }
  });
  return zuix;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(693);
/******/ 	zuix = __webpack_exports__;
/******/ 	
/******/ })()
;